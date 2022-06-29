const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
    const embed = new MessageEmbed()
    .setColor("GREEN")
    .setDescription(`Latency: **${client.ws.ping}ms**`);
    message.channel.send({embeds: [embed]});
}

exports.info = {
    name: "ping",
    description: "See if im alive!",
    aliases: []
}