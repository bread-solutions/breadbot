const { Client, Collection } = require('discord.js');
const fs = require('fs');
const { join } = require('path');
const botConfig = require('./Botconfig')
const config = botConfig.config

class BreadClient extends Client {
    constructor(options) {
        super(options);
        this.commands = new Collection();
        this.aliases = new Collection();
    }
}

const client = new BreadClient({intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS"]});

global.__basedir = __dirname;


//Load all commands
const commands  = fs.readdirSync(join(__dirname, `./src`, `commands`));
    for(let command of commands) {
        const info = require(`./src/commands/${command}`);
        if (info.info.name){
            client.commands.set(info.info.name, info);
            setTimeout(() => {
                console.log(`Loaded Command ./src/commands/${command}`);
            }, 1000);
        } else {
            console.log(`Command ${command} has no name`);
            continue;
        }
        if (info.info.aliases){
            try {
                info.info.aliases.forEach(a => {
                    client.commands.set(a, info);
                })
            } catch (e) {
                console.log(`An error occured when adding an aliases for ${command}`);
                continue;
            }
        }
    };

//Load all events
const events = fs.readdirSync(join(__dirname, `./src`, `events`));
events.forEach(e => {
    const name = e.split('.')[0];
    const event = require(`./src/events/${e}`);
    client.on(name, event.bind(null, client));
    delete require.cache[require.resolve(`./src/events/${e}`)];
});

client.login(config.token);