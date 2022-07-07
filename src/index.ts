import { Client, Collection, Guild, Intents, Role } from "discord.js";
import config  from "./config"
import path from "path";
import { readdirSync } from "fs";
import mysql from 'mysql';
import { ICommand } from "./backend/interfaces/ICommand";
import { IEvent } from "./backend/interfaces/IEvent";
import { checkAllMutes } from "./utils/db";

class BreadClient extends Client {
    [x: string]: any;
    public commands: Collection<string, ICommand> = new Collection();
    public events: Collection<string, IEvent> = new Collection();

}

new Intents("8")
const client = new BreadClient({intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS"]});

// Login to mysql
const pool = mysql.createPool({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    waitForConnections: true,
});

pool.getConnection((err: any, connection: any) => {
    if (err) throw err;
    console.log("Connected to MySQL");
})

pool.on('release', function (connection: any) {
    //console.log("Connection %d released", connection.threadId);
});

// Load commands
const commands = readdirSync(path.join(__dirname, ".", "commands"));
for (const file of commands) {
    if (file.endsWith(".map")) continue;
    const { command } = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Load events
const eventPath = path.join(__dirname, ".", "events");
readdirSync(eventPath).forEach(async (file) => {
    if (file.endsWith(".map")) return;
    const { event } = await import(`${eventPath}/${file}`);
    client.events.set(event.name, event);
    client.on(event.name, event.run.bind(null, client, pool));
});


client.login(config.token)
export default client;
export { pool };