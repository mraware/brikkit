const Parser = {};

Parser.JoinParser = require('./join.js');
Parser.ChatParser = require('./chat.js');
Parser.PreStartParser = require('./prestart.js');
Parser.StartParser = require('./start.js');
Parser.MapChangeParser = require('./mapchange.js');
Parser.MinigameResetParser = require('./minigamereset.js');

module.exports = Parser;