const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');



exports.run = async (client, message, args, con) => {
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