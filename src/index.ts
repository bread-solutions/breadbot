const { Client } = require("discord.js");
import config  from "./config"

const client = new Client({intents:['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_MESSAGE_REACTIONS'], partials: ["MESSAGE", 'USER'] });

client.once('ready', async () => {
    console.log("Online")
});

client.login(config.token)