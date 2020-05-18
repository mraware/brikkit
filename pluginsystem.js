const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const disrequire = require('disrequire');

const tmp = require('tmp');
tmp.setGracefulCleanup();

class PluginSystem {
    constructor() {
        this._plugins = {};
        this._cleanup = [];
    }
    
    getAvailablePlugins() {
        return fs.readdirSync('plugins');
    }
    
    loadPlugin(plugin) {
        if(plugin.endsWith('zip'))
            this._loadPluginZip(plugin);
        else
            this._loadPluginDirectory(plugin);
    }
    
    loadAllPlugins() {
        const pluginPaths = this.getAvailablePlugins()
            .map(plugin => path.parse(plugin));
        
        // if 2 plugins have the same name (/example/ and /example.zip),
        // let's give priority to the ones that are in a directory
        // for this, we create a mapping of a bare plugin name (example)
        // and the best [that we found so far] filename
        const pluginNameMap = {};
        
        pluginPaths.forEach(plugin => {
            if(plugin.name in pluginNameMap) {
                // if the plugin is already in the map, we gotta compare them
                const otherPlugin = pluginNameMap[plugin.name];
                
                // if the other plugin is a zip, the current plugin is
                // a directory, thus we prefer it to the other
                if(otherPlugin.ext === 'zip')
                    pluginNameMap[plugin.name] = plugin;
                else // otherwise we prefer the other plugin
                    pluginNameMap[plugin.name] = otherPlugin;
            } else // if the plugin isn't in the mapping, simply add it
                pluginNameMap[plugin.name] = plugin;
        });
        
        this._cleanup.forEach(cleanup => {
          if (typeof cleanup === 'function')
            cleanup()
        });
        this._cleanup = [];
        
        Object.values(pluginNameMap).forEach(pluginPath => this.loadPlugin(pluginPath.base));
    }
    
    _loadPluginZip(plugin) {
        const path = tmp.dirSync().name;
        execSync(`unzip ./plugins/${plugin} -d ${path}`);
        try {
          disrequire(`${path}/index.js`);
        } catch(error) {
          //lol idc
        }
        const cleanup = require(`${path}/index.js`);
        if (cleanup) {
          this._cleanup.push(cleanup);
        }
    }
    
    _loadPluginDirectory(plugin) {
        try {
          disrequire(`${process.cwd()}/plugins/${plugin}/index.js`);
        } catch(error) {
          //lol idc
        }
        const cleanup = require(`${process.cwd()}/plugins/${plugin}/index.js`);
        if (cleanup) {
          this._cleanup.push(cleanup);
        }
    }
}

module.exports = PluginSystem;