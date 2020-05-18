global.Brikkit.on('join', (evt) => {
  if ('rlcbm' === evt.getPlayer().getUsername()) {
    global.Brikkit.say(`"<emoji>omegga</><emoji>omegga</><emoji>omegga</>   <emoji>omegga</>             <emoji>omegga</><emoji>omegga</><emoji>omegga</>  <emoji>omegga</><emoji>omegga</><emoji>omegga</>          <emoji>omegga</>  <emoji>omegga</>"`);
    global.Brikkit.say(`"<emoji>omegga</>     <emoji>omegga</>   <emoji>omegga</>             <emoji>omegga</>      <emoji>omegga</>     <emoji>omegga</>  <emoji>omegga</><emoji>omegga</>  <emoji>omegga</><emoji>omegga</>"`);
    global.Brikkit.say(`"<emoji>omegga</><emoji>omegga</><emoji>omegga</>   <emoji>omegga</>             <emoji>omegga</>            <emoji>omegga</><emoji>omegga</><emoji>omegga</>     <emoji>omegga</>   <emoji>omegga</><emoji>omegga</>  <emoji>omegga</>"`);
    global.Brikkit.say(`"<emoji>omegga</>     <emoji>omegga</>   <emoji>omegga</>             <emoji>omegga</>            <emoji>omegga</>  <emoji>omegga</>  <emoji>omegga</>  <emoji>omegga</>  <emoji>omegga</>"`);
    global.Brikkit.say(`"<emoji>omegga</>     <emoji>omegga</>   <emoji>omegga</><emoji>omegga</><emoji>omegga</>   <emoji>omegga</><emoji>omegga</><emoji>omegga</>  <emoji>omegga</><emoji>omegga</><emoji>omegga</>     <emoji>omegga</>      <emoji>omegga</>"`);
  }
});

let date = {};

global.Brikkit.on('chat', (evt) => {
  try {
    const user = evt.getSender().getUsername();
    [command, ...args] = evt.getContent().split(' ');
    if (command && command[0] === '!') {
      if(command.toLowerCase() === '!rlcbm') {
        const newDate = Date.now();

        if (!date[user] || newDate > date[user] + 60000 || user === 'rlcbm') {
          date[user] = newDate;
          global.Brikkit.say(`"<emoji>omegga</><emoji>omegga</><emoji>omegga</>   <emoji>omegga</>             <emoji>omegga</><emoji>omegga</><emoji>omegga</>  <emoji>omegga</><emoji>omegga</><emoji>omegga</>          <emoji>omegga</>  <emoji>omegga</>"`);
          global.Brikkit.say(`"<emoji>omegga</>     <emoji>omegga</>   <emoji>omegga</>             <emoji>omegga</>      <emoji>omegga</>     <emoji>omegga</>  <emoji>omegga</><emoji>omegga</>  <emoji>omegga</><emoji>omegga</>"`);
          global.Brikkit.say(`"<emoji>omegga</><emoji>omegga</><emoji>omegga</>   <emoji>omegga</>             <emoji>omegga</>            <emoji>omegga</><emoji>omegga</><emoji>omegga</>     <emoji>omegga</>   <emoji>omegga</><emoji>omegga</>  <emoji>omegga</>"`);
          global.Brikkit.say(`"<emoji>omegga</>     <emoji>omegga</>   <emoji>omegga</>             <emoji>omegga</>            <emoji>omegga</>  <emoji>omegga</>  <emoji>omegga</>  <emoji>omegga</>  <emoji>omegga</>"`);
          global.Brikkit.say(`"<emoji>omegga</>     <emoji>omegga</>   <emoji>omegga</><emoji>omegga</><emoji>omegga</>   <emoji>omegga</><emoji>omegga</><emoji>omegga</>  <emoji>omegga</><emoji>omegga</><emoji>omegga</>     <emoji>omegga</>      <emoji>omegga</>"`);
        }
      }
    }
  } catch(error) {
    console.log('error !rlcbm');
  }
});