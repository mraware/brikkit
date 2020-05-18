let defaultWaterLevel = 10000;
let levelAddAmount = 5;
let waterInterval = 1000;
let waterLevel = 10000;
let waterTimeout = 30000;
let maxWaterLevel = levelAddAmount * waterInterval;
let interval, timeout;
let bWaves = true;

const color = 'ff0000';
const commandColor = 'ffff00';

global.Brikkit.on('minigamereset', evt => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  waterLevel = defaultWaterLevel;
  maxWaterLevel = defaultWaterLevel + (levelAddAmount * waterInterval);
  global.Brikkit.say(`<color="${color}"><b>Round ended... Resetting.</></> Things might be a little wierd.`); 
  // global.Brikkit.clearAllBricks(0);
  global.Brikkit.setWaterLevel(waterLevel);
  // global.Brikkit.loadBricks('"not fortnite"');

  stopWaterAndWait();
});

function raiseWater() {
  global.Brikkit.say(`<color="${color}"><b>The water has started rising!</></>`); 
  interval = setInterval(() => {
    global.Brikkit.setWaterLevel(waterLevel); 
    waterLevel = waterLevel + levelAddAmount;
    if (bWaves && waterLevel >= maxWaterLevel) {
      maxWaterLevel = maxWaterLevel + (levelAddAmount * waterInterval);
      stopWaterAndWait();
    }
  }, waterInterval)
}

function stopWaterAndWait() {
  if (interval) {
    global.Brikkit.say(`<color="${color}"><b>The water has stopped rising... for now.</></>`); 
    clearInterval(interval);
  }
  if (timeout) {
    clearTimeout(timeout);
  }


  for (let i = 1; i <= 10; i++) {
    setTimeout(() => {
      if (i === 10) {
        global.Brikkit.say(`<color="${color}"><b>The water will start rising in ${i}</></>`); 
      } else {
        global.Brikkit.say(`<color="${color}"><b>${i}</></>`); 
      }
    }, waterTimeout - i*1000)
  }

  timeout = setTimeout(() => {
    raiseWater();
  }, waterTimeout)
}


global.Brikkit.on('chat', (evt) => {
  if (['Aware', 'Ghille'].includes(evt.getSender().getUsername())) {
    [command, ...args] = evt.getContent().split(' ');
    if (command && command[0] === '!') {
      if(command.toLowerCase() === '!setwaterlevel') {
        const level = +args[0];
        if (level !== null && level !== undefined) {
          global.Brikkit.say(`<color="${commandColor}">Setting water level to <b>${level}</>.</>`);
          waterLevel = level;
          global.Brikkit.setWaterLevel(level);
        }
      } else if (command.toLowerCase() === '!setwaterincrease') {
        const level = +args[0];
        if (level !== null && level !== undefined) {
          global.Brikkit.say(`<color="${commandColor}">Setting water increase amount to <b>${level}</>.</>`);
          levelAddAmount = level
        }
      } else if (command.toLowerCase() === '!setwaterinterval') {
        const interval = +args[0];
        if (interval !== null && interval !== undefined) {
          global.Brikkit.say(`<color="${commandColor}">Setting water raise interval to <b>${interval}</>.</>`);
          waterInterval = interval
        }
      } else if (command.toLowerCase() === '!setwatertimeout') {
        const timeout = +args[0];
        if (interval !== null && interval !== undefined) {
          global.Brikkit.say(`<color="${commandColor}">Setting water timeout to <b>${timeout}</>.</>`);
          waterTimeout = timeout
        }
      } else if (command.toLowerCase() === '!stopwater') {
        global.Brikkit.say(`<color="${commandColor}">Force stopping the water.</>`);
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
      } else if (command.toLowerCase() === '!startwater') {
        global.Brikkit.say(`<color="${commandColor}">Force starting the water.</>`);
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        raiseWater();
      } else if (command.toLowerCase() === '!setdefaultwaterlevel') {
        const level = +args[0];
        if (level !== null && level !== undefined) {
          global.Brikkit.say(`<color="${commandColor}">Setting default water level to <b>${level}</>.</>`);
          defaultWaterLevel = level
        }
      } else if (command.toLowerCase() === '!togglewaves') {
        bWaves = !bWaves;
        if (bWaves) {
          global.Brikkit.say(`<color="${commandColor}">Enabled waves.</>`);
        } else {
          global.Brikkit.say(`<color="${commandColor}">Disabled waves.</>`);
        }
      } else if (command.toLowerCase() === '!helpwater') {
        global.Brikkit.say(`<color="${commandColor}">!SetWaterLevel amount</> - ${waterLevel}`);
        global.Brikkit.say(`<color="${commandColor}">!SetWaterIncrease amount</> - ${levelAddAmount}`);
        global.Brikkit.say(`<color="${commandColor}">!SetWaterInterval amount</> - ${waterInterval}`);
        global.Brikkit.say(`<color="${commandColor}">!SetWaterTimeout amount</> - ${waterTimeout}`);
        global.Brikkit.say(`<color="${commandColor}">!SetDefaultWaterLevel amount</> - ${defaultWaterLevel}`);
        global.Brikkit.say(`<color="${commandColor}">!ToggleWaves</> - ${bWaves}`);
        global.Brikkit.say(`<color="${commandColor}">!StopWater</>`);
        global.Brikkit.say(`<color="${commandColor}">!StartWater</>`);
      }
    }
  }
});

module.exports = () => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
}