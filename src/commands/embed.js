const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');



exports.run = async (client, message, args, con) => {
    message.delete();
    const msg = args.join(" ");

    const embed = new MessageEmbed()
    .setTitle("You've been muted!")
    .setColor("#FAD69E")
    .setDescription(msg);
    message.channel.send({embeds: [embed]});
}

exports.info = {
    name: "embed",
    description: "See if im alive!",
    aliases: []
}