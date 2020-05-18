const fs = require('fs');
const stripAnsi = require('strip-ansi');

const Brickadia = require('./brickadia.js');
const Terminal = require('./terminal.js');
const Configuration = require('./data/configuration.js');

const Parser = require('./parsers/parser.js');

const PluginSystem = require('./pluginsystem.js');
const Scraper = require('./scraper.js');

const Event = require('./events/event.js');

class Brikkit {
  constructor(configuration, logStream) {
    global.Brikkit = this;

    configuration = new Configuration(configuration);

    this._brickadia = new Brickadia(configuration);
    if (process.env.DEV === 'TRUE')
      this._developmentMode();
    else {
      this._brickadia.on('out',
        line => logStream.write(`bout: "${line}"\n`));
      this._brickadia.on('err',
        line => logStream.write(`berr: "${line}"\n`));
    }

    // make an object entry for each type of event
    this._callbacks = {};
    for (const eventKey of Object.keys(Event)) {
      const eventConstructor = Event[eventKey];
      const getType = eventConstructor.prototype.getType;
      this._callbacks[getType()] = [];
    }

    this._playersByName = {};

    this._scraper = new Scraper();
    this._pluginSystem = new PluginSystem();

    this._brickadia.on('out', line => this._handleBrickadiaLine(line));
    this._brickadia.on('close', () => {
      throw new Error('Brickadia closed (probable crash)');
    });

    this._terminal = new Terminal();
    this._terminal.on('out', line => {
      const [cmd, ...args] = line.split(' ');
      if (cmd === 'cmd')
        this._brickadia.write(`${args.join(' ')}\n`);
    });

    console.log(' --- STARTING BRIKKIT SERVER --- ');

    this.on('prestart', evt => {
      this._brickadia.write(`travel ${configuration.getMap()}\n`);
    });

    this.on('start', evt => {
      console.log(' --- SERVER START --- ');
    });

    this._joinParser = new Parser.JoinParser();
    this._chatParser = new Parser.ChatParser();
    this._preStartParser = new Parser.PreStartParser();
    this._startParser = new Parser.StartParser();
    this._mapChangeParser = new Parser.MapChangeParser();
    this._minigameResetParser = new Parser.MinigameResetParser();
  }

  /* 
   * Types available:
   * 'chat': when someone sends a chat message
   *      args: (message)
   *      message: {
   *          username: "n42k",
   *          content: "Hello World!"
   *      }
   */
  on(type, callback) {
    if (this._callbacks[type] === undefined)
      throw new Error('Undefined Brikkit.on type.');

    this._callbacks[type].push(callback);
  }

  getPlayerFromUsername(username) {
    const player = this._playersByName[username];
    return player === undefined ? null : player;
  }

  say(message) {
    const messages = message.split('\n');

    for (const msg of messages)
      this._brickadia.write(`Chat.Broadcast ${msg}\n`);
  }

  saveBricks(saveName) {
    this._brickadia.write(`Bricks.Save ${saveName}\n`);
  }

  loadBricks(saveName) {
    this._brickadia.write(`Bricks.Load ${saveName}\n`);
  }

  getAllMinigamesRound() {
    this._brickadia.write(`GetAll BP_Ruleset_C CurrentRound\n`);
  }

  setWaterLevel(level) {
    this._brickadia.write(`CE SetWaterLevel ${level}\n`);
  }

  getSaves(callback) {
    fs.readdir('brickadia/Brickadia/Saved/Builds/', {}, (err, files) => {
      if (err)
        throw err;

      const filesWithoutExtension = files.map(file => file.slice(0, -4));

      callback(filesWithoutExtension);
    });
  }

  // DANGER: clears all bricks in the server
  clearAllBricks() {
    this._brickadia.write(`Bricks.ClearAll\n`);
  }

  // this disconnects all players.
  changeMap(mapName) {
    if (['Studio_Night',
      'Studio_Day',
      'Studio',
      'Plate',
      'Peaks'].indexOf(mapName) === -1)
      return;

    this._brickadia.write(`travel ${mapName}\n`);
  }

  getScraper() {
    return this._scraper;
  }

  reloadPlugins() {
    this._callbacks = {};
    for (const eventKey of Object.keys(Event)) {
      const eventConstructor = Event[eventKey];
      const getType = eventConstructor.prototype.getType;
      this._callbacks[getType()] = [];
    }
    this._pluginSystem.loadAllPlugins();

    this._putEvent(new Event.PreStartEvent(new Date()));
    setTimeout(() => this._putEvent(new Event.StartEvent(new Date())), 1500);
  }

  getPluginSystem() {
    return this._pluginSystem;
  }

  // adds callbacks to print out stdout and stderr directly from Brickadia
  _developmentMode() {
    this._brickadia.on('out', line => console.log(`bout: "${line}"`));
    this._brickadia.on('err', line => console.log(`berr: "${line}"`));
  }

  _handleBrickadiaLine(line) {
    function getFromMatches(matches) {
      const dateString = matches[1]
        .replace(':', '.')
        .replace('-', 'T')
        .replace('.', '-')
        .replace('.', '-')
        .replace('.', ':')
        .replace('.', ':');

      const date = new Date(dateString + 'Z');

      // which object generated the message
      // UE4 specific: LogConfig, LogInit, ...
      // useful for understanding the line
      const generator = matches[2];

      const restOfLine = matches[3];

      return {
        date,
        generator,
        restOfLine
      }
    }

    line = stripAnsi(line);

    let matches = /^\[(.*?)\]\[.*?\](.*?): (.*)$/.exec(line);

    if (matches === undefined || matches === null) {
      matches = /^\[(.*?)\]\[.*?\](\d*?)\) (.*)$/.exec(line);

      if (matches === undefined || matches === null)
        return;

      const { date, generator, restOfLine } = getFromMatches(matches)

      const minigameReset = this._minigameResetParser.parse(generator, restOfLine);
      if (minigameReset) {
        this._putEvent(new Event.MinigameResetEvent(date, minigameReset));
      }

    } else {
      const { date, generator, restOfLine } = getFromMatches(matches)

      const joinedPlayer = this._joinParser.parse(generator, restOfLine);
      if (joinedPlayer !== null) {
        this._addPlayer(joinedPlayer);
        this._putEvent(new Event.JoinEvent(date, joinedPlayer));
      }

      const chatParserResult = this._chatParser.parse(generator, restOfLine);
      if (chatParserResult !== null) {
        const [username, message] = chatParserResult;
        const player = this.getPlayerFromUsername(username);

        this._putEvent(new Event.ChatEvent(date, player, message));
      }

      const serverPreStarted =
        this._preStartParser.parse(generator, restOfLine);
      if (serverPreStarted)
        this._putEvent(new Event.PreStartEvent(date));

      const serverStarted = this._startParser.parse(generator, restOfLine);
      if (serverStarted)
        this._putEvent(new Event.StartEvent(date));

      const mapChanged = this._mapChangeParser.parse(generator, restOfLine);
      if (mapChanged)
        this._putEvent(new Event.MapChangeEvent(date));
    }
  }

  _putEvent(event) {
    for (const callback of this._callbacks[event.getType()])
      callback(event);
  }

  _addPlayer(player) {
    this._playersByName[player.getUsername()] = player;
  }
}

module.exports = Brikkit;