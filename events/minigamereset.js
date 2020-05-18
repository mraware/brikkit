const BaseEvent = require('./baseevent.js');

// TODO: make mapchange event have a field with the map name
class MinigameResetEvent extends BaseEvent {
    constructor(date) {
        super(date);
    }
    
    getType() {
        return 'minigamereset';
    }
};

module.exports = MinigameResetEvent;