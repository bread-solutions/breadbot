const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const config = require('../../config.json');
const fs = require("fs");



exports.run = async (client, message, args, con) => {
    message.delete();

    if(!message.member.permissions.has("MANAGE_MESSAGES")) return message.channel.send({content: `You do not have permission to use this command!`});
    let member = message.mentions.members.first() || await message.guild.members.fetch(args[0]); 
    if(!member) return message.channel.send({content: `You must mention a user or provide a user ID!`});
            //message.channel.send({ content: `**${member} has been unmuted**` });
             con.query('SELECT * FROM mutedata WHERE `discordid` = ?', [member.id], async (err, rows) => {
                var  parsed_data = JSON.parse(rows[0].prevroles);
                parsed_data.forEach(async r => {
                    member.roles.add(r);
                })
                member.roles.remove(config.mutedRole);
                con.query('DELETE FROM mutedata WHERE `discordid` = ?', [member.id], async (err, rows) => {})
            });
}

exports.info = {
    name: "unmute",
    description: "See if im alive!",
    aliases: ["um"]
}