const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');



exports.run = async (client, message, args, con) => {
    if(!message.member.permissions.has("MANAGE_MESSAGES")) return message.reply({content: `You do not have permission to use this command!`, ephemeral: true});
    let clearNum = +args[0] + +1;

    if(!clearNum) return message.reply({content: `Please provide a number of messages to delete!`, ephemeral: true});
    if(isNaN(clearNum)) return message.reply({content: `Please provide a number of messages to delete!`, ephemeral: true});
    if(clearNum < 1) return message.reply({content: `Please provide a valid number of messages to delete!`, ephemeral: true});
    if (clearNum >= 100) return message.reply({content: `Please provide a valid number of messages to delete!`, ephemeral: true});

    message.channel.bulkDelete(clearNum);
}

exports.info = {
    name: "clear",
    description: "See if im alive!",
    aliases: ["purge"]
}