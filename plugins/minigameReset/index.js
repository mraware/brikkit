const commandColor = 'ffff00';

let interval;

let minigameReset = false;

global.Brikkit.on('chat', (evt) => {
  if (['Aware', 'Ghille'].includes(evt.getSender().getUsername())) {
    [command, ...args] = evt.getContent().split(' ');
    if (command && command[0] === '!') {
      if(command.toLowerCase() === '!toggleminigamereset') {

        if (minigameReset) {
          global.Brikkit.say(`<color="${commandColor}">Minigame reset disabled.</>`);
          if(interval)
            clearInterval(interval);
          interval = null;
        } else {
          global.Brikkit.say(`<color="${commandColor}">Minigame reset enabled.</>`);
          interval = setInterval(() => {
            global.Brikkit.getAllMinigamesRound();
          }, 2000);
        }

        minigameReset = !minigameReset;
        
      }
    }
  }
});


module.exports = () => {
  if(interval)
    clearInterval(interval);
}