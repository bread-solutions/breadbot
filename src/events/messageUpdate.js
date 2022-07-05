const config = require("../../config.json");
const { MessageEmbed } = require('discord.js');

module.exports = async(client, con, message, newMessage) => {
    if (message.author.bot) return;
    
    const logembed = new MessageEmbed()
    .setColor("RED")
    .setTitle("Audit Log - Edited Message")
    .setDescription(`**User:** ${message.author.tag} (${message.author.id})`)
    .addField("Message", `${message.content}`)
    .addField("New Message", `${newMessage.content}`)
    .addField("Channel", `${message.channel.name} (${message.channel.id})`)
    .addField("Message ID", `${message.id}`)
    .setTimestamp();
    const logChannel = await client.channels.fetch(config.logging.editedMessageLog);
    if (!logChannel) return console.log("Edited message log channel not found");
    logChannel.send({embeds: [logembed]});
}