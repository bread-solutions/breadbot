const { Client, Collection, MessageEmbed } = require('discord.js');
const fs = require('fs');
const { get } = require('http');
const { join } = require('path');
const config = require('./config.json');
let con;


class BreadClient extends Client {
    constructor(options) {
        super(options);
        this.commands = new Collection();
        this.aliases = new Collection();
    }
}

const client = new BreadClient({intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS"]});

global.__basedir = __dirname;

try {
    const mysql = require("mysql");
    const information = {
        connectionLimit: 10,
        queueLimit: 5000,
        host: config.mysql.host,
        user: config.mysql.user,
        password: config.mysql.password,
        database: config.mysql.database
    };

    con = mysql.createPool(information);
    con.getConnection((err, connection) => {
        if (err) throw console.log(`\x1b[41mCould not connect to the database: ${err}\x1b[0m`);
        console.log("\x1b[32mConnected to database\x1b[0m");
    });
} catch (e) {
    console.log(e);
}

//Load all commands
const commands  = fs.readdirSync(join(__dirname, `./src`, `commands`));
    for(let command of commands) {
        const info = require(`./src/commands/${command}`);
        if (info.info.name){
            client.commands.set(info.info.name, info);
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
    client.on(name, event.bind(null, client, con));
    delete require.cache[require.resolve(`./src/events/${e}`)];
});


client.login(config.token);

async function checkAllMutes() {
    const guild = await client.guilds.fetch(config.guildid);
    const mutedRole = await guild.roles.fetch(config.mutedRole);
    if (!mutedRole) return;
    con.query(`SELECT * FROM mutedata`, async (err, rows) => {
        const getMutedUsersPrePromise = rows.map(async row => row.discordId);
        const getMutedUsers = await Promise.all(getMutedUsersPrePromise);

        let currDate = new Date();
        if (getMutedUsers.length > 0) {
            for (let user of getMutedUsers) {
                const member = await guild.members.fetch(user);
                if (!member) continue;
                 con.query(`SELECT * FROM mutedata WHERE discordId = ?`, [user], async (err, rows) => {
                    if (err) throw err;
                    if (rows.length > 0) {
                        if (rows[0].muteTime === null) {
                            return;
                        }
                        const data = JSON.parse(rows[0].prevroles);
                        const mutedUntil = new Date(rows[0].muteTime);
                        if (currDate > mutedUntil) {
                            member.roles.remove(mutedRole);
                            data.forEach(async r => {
                                member.roles.add(r);                
                            });
                            con.query(`DELETE FROM mutedata WHERE discordId = ?`, [user], (err, rows) => {
                                if (err) throw err;
                            });
                        }
                    }
                 });
            }
            //console.log(`Checking Mutes...`);
        } else {
            //console.log("No muted users");
            return;
        }
    });

    setInterval(checkAllMutes, 1000 * 60);
}

checkAllMutes();