const botConfig = require('../../Botconfig');
const config = botConfig.config

module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    const prefix = config.prefix;
    const messageArray = message.content.split(" ");
    const command = messageArray[0];
    const args = messageArray.slice(1);

    if (!command.startsWith(prefix)) return;

    const commandFile = client.commands.get(command.slice(prefix.length));
    if (commandFile) commandFile.run(client, message, args);
}