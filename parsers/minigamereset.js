const BaseParser = require('./baseparser.js');

const Player = require('../data/player.js');

/*
This line is related to player messages:
[2019.09.14-18.34.41:930][443]LogChat: n: hello
*/

class MinigameResetParser extends BaseParser {
  constructor() {
    super();
    this.minigames = {};
  }

  parse(generator, line) {
    const [,roundNumber] = line.split('= ');
    if (roundNumber) {
      if (this.minigames[generator] !== roundNumber) {
        this.minigames[generator] = roundNumber;
        return true;
      }
      this.minigames[generator] = roundNumber;
    }

    return false;
  }
}

module.exports = MinigameResetParser;