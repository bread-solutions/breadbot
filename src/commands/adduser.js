const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

exports.run = async (client, message, args, con) => {
    message.delete();
    if(!message.member.permissions.has("MANAGE_MESSAGES")) return message.channel.send({content: `You do not have permission to use this command!`});

    let user;
    if (args[0]) {
        user = message.mentions.members?.first() || await message.guild.members.fetch(args[0]);
    }
    message.channel.permissionOverwrites.edit(user.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true })
    message.channel.send(`${user} has been added from the ticket`).then(msg => setTimeout(() => msg.delete(), 5000));
}

exports.info = {
    name: "adduser",
    description: "See if im alive!",
    aliases: []
}