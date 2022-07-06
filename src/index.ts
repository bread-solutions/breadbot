import { Client, Collection } from "discord.js";
import config  from "./config"
import path from "path";
import { readdirSync } from "fs";
import mysql from 'mysql2';
import { ICommand } from "./backend/interfaces/ICommand";
import { IEvent } from "./backend/interfaces/IEvent";

class BreadClient extends Client {
    [x: string]: any;
    public commands: Collection<string, ICommand> = new Collection();
    public events: Collection<string, IEvent> = new Collection();

}
const client = new BreadClient({intents:['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_MESSAGE_REACTIONS'], partials: ["MESSAGE", 'USER'] });

// Login to mysql
const pool = mysql.createPool({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    waitForConnections: true,
}).promise();

pool.getConnection().then(connection => {
    console.log("Connection to database established!");
    connection.release();
}).catch(err => console.log(`Couldn't connect to database: ${err}`));

// Load commands
const commands = readdirSync(path.join(__dirname, ".", "commands"));
for (const file of commands) {
    const { command } = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Load events
const eventPath = path.join(__dirname, ".", "events");
readdirSync(eventPath).forEach(async (file) => {
    const { event } = await import(`${eventPath}/${file}`);
    client.events.set(event.name, event);
    client.on(event.name, event.run.bind(null, client, pool));
});

client.login(config.token)
export default client;
export { pool };