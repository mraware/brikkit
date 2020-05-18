const commandColor = 'ffff00';

global.Brikkit.on('chat', (evt) => {
  if (['Aware', 'Ghille'].includes(evt.getSender().getUsername())) {
    [command, ...args] = evt.getContent().split(' ');
    if (command && command[0] === '!') {
      if(command.toLowerCase() === '!reloadplugins') {
        global.Brikkit.say(`<color="${commandColor}">Reloading plugins.</>`);
        global.Brikkit.reloadPlugins();
        setTimeout(() => global.Brikkit.say(`<color="${commandColor}">Reloaded plugins.</>`), 1500);
      }
    }
  }
});