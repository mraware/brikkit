const fs = require('fs');

const confPath = `${process.cwd()}/conf/autosaver.json`;

let interval;

let conf;
try {
	conf = require(confPath);
} catch(e) {
	conf = {
		intervalInSeconds: 300,
		saveName: 'autosave_%date',
		saveMessage: 'Autosaved bricks (if any).'
	};

	fs.writeFileSync(confPath, JSON.stringify(conf, null, 2));
}

async function autosave() {
    // replace %date with the current date, as an ISO8601 date
    const isoDate = (new Date()).toISOString();
    const finalSaveName = conf.saveName.replace('%date', isoDate);

    global.Brikkit.saveBricks(finalSaveName);
    global.Brikkit.say(`<color="00ff00">Autosaved Bricks <b>${finalSaveName}</></>`);
}

const dateRegex = `\\d\\d\\d\\d-\\d\\d-\\d\\dT\\d\\d_\\d\\d_\\d\\d\\.\\d\\d\\dZ`;
global.Brikkit.on('start', evt => {
    global.Brikkit.getSaves(saves => {
        // create a regex for matching the autosave file (include %date)
        const regexString = `^${conf.saveName.replace('%date', dateRegex)}$`;
        const regex = new RegExp(regexString);
        
        // find the latest file that corresponds to the regex
        let latestSave = undefined;
        for(let i = 0; i < saves.length; ++i) {
            const save = saves[i];
            
            if(!regex.test(save))
                continue;
            
            if(latestSave === undefined) {
                latestSave = save;
                continue;
            }
            
            if(save > latestSave)
                latestSave = save;
        }
        
        // if a file was found, load it
        if(latestSave !== undefined)
            global.Brikkit.loadBricks(latestSave);
        
        // start autosaving after we load the save
        interval = setInterval(autosave,  conf.intervalInSeconds * 1000);
    });
});

module.exports = () => {
  if(interval)
    clearInterval(interval);
}