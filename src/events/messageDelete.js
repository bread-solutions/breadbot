const config = require("../../config.json");
const { MessageEmbed } = require('discord.js');

module.exports = async(client, con, message) => {
    if (message.author.bot) return;
    if (message.content.startsWith(config.prefix)) return;

    const logembed = new MessageEmbed()
    .setColor("RED")
    .setTitle("Audit Log - Deleted Message")
    .setDescription(`**User:** ${message.author.tag} (${message.author.id})`)
    .addField("Message", `${message.content}`)
    .addField("Channel", `${message.channel.name} (${message.channel.id})`)
    .addField("Message ID", `${message.id}`)
    .setTimestamp();
    const logChannel = await client.channels.fetch(config.logging.deletedMessageLog);
    if (!logChannel) return console.log("Deleted message log channel not found");
    logChannel.send({embeds: [logembed]});
}