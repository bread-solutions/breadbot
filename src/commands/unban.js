const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const config = require('../../config.json');
const fs = require("fs");



exports.run = async (client, message, args, con) => {
    message.delete();

    if(!message.member.permissions.has("BAN_MEMBER")) return message.channel.send({content: `You do not have permission to use this command!`});
    let member = args[0];
    if(!member) return message.channel.send({content: `You must mention a user or provide a user ID!`});
    con.query('INSERT INTO `moderation` (`action`, `perpid`, `moderator`) VALUES (?, ?, ?)', ["Unban", member, message.author.id], async (err, rows) => {
        if(err) throw err;
        message.channel.send({ content: `**<@${member}> has been unbanned**`}).then( async () => {
            try {
                await message.guild.bans.fetch().then(az => {
                    az.forEach(c => {
                        if (c.user.id === member) {
                            message.guild.members.unban(`${member}`).catch(e => console.log(e));
                        }
                    });
                });
            } catch (e) {
                console.log(e);
            }
        });
        con.query('SELECT * FROM `moderation` WHERE `caseid` = ?', [rows.insertId], async (err, rows) => {
            let embed = new MessageEmbed()
            .setColor("#FAD69E")
            .setTitle("New Unban Entry")
            .setDescription(`Perp: <@${member}> (${member})\nModerator: ${message.author} (${message.author.id})\nCase ID: \`${rows[0].caseid}\``)
            .setTimestamp() 
            let logch = await client.channels.fetch(config.logging.modlog);  
            logch.send({ embeds: [embed] }); 
        })
    });
}

exports.info = {
    name: "unban",
    description: "See if im alive!",
    aliases: ["ub"]
}