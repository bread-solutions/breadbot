const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const config = require('../../config.json');
const fs = require("fs");



exports.run = async (client, message, args, con) => {
    message.delete();

    if(!message.member.permissions.has("MANAGE_MESSAGES")) return message.channel.send({content: `You do not have permission to use this command!`});
    let member = message.mentions.members.first() || await message.guild.members.fetch(args[0]); 
    if(!member) return message.channel.send({content: `You must mention a user or provide a user ID!`});
    let reason = args.slice(2).join(" ");
    if (!reason) reason = "No reason provided.";
    let mutetime =  args[1];
    let allRoles = member.roles.cache.map(r => r.id);
    allRoles.pop();
    
    con.query('INSERT INTO `moderation` (`action`, `perpid`, `reason`, `moderator`) VALUES (?, ?, ?, ?)', ["Mute", member.id, reason, message.author.id], (err, rows) => {
        if(err) throw err;
        if (!mutetime) {
            message.channel.send({ content: `**${member} has been muted for:** ${reason}` });
            con.query('INSERT INTO mutedata (`discordid`, `prevroles`) VALUES (?, ?)', [member.id, JSON.stringify(allRoles)], (err, rows) => {
                if(err) throw err;
                 member.roles.cache.forEach(async role => {
                    if (role.name !== '@everyone') {
                        await member.roles.remove(role, {timeout: 2000});
                    }
                })
                member.roles.add(config.mutedRole);
            });
        } else {
            message.channel.send({ content: `**${member} has been muted for ${mutetime} for:** ${reason}` })
            var duration = new Date();
            if (mutetime.includes("m")) {
                duration.setMinutes(duration.getMinutes() + parseInt(mutetime.replace("m", "")));
            } else if (mutetime.includes("h")) {
                duration.setHours(duration.getHours() + parseInt(mutetime.replace("h", "")));
            } else if (mutetime.includes("d")) {
                duration.setDate(duration.getDate() + parseInt(mutetime.replace("d", "")));
            } else if (mutetime.includes("s")) {
                duration.setSeconds(duration.getSeconds() + parseInt(mutetime.replace("s", "")));
            }
            con.query('INSERT INTO mutedata (`discordid`, `prevroles`, `muteTime`) VALUES (?, ?, ?)', [member.id, JSON.stringify(allRoles), duration], async (err, rows) => {
                if (err) throw err;
                member.roles.cache.forEach(async role => {
                    if (role.name !== '@everyone') {
                        await member.roles.remove(role, {timeout: 2000});
                    }
                    member.roles.add(config.mutedRole);
                });
            });
        }
        con.query('SELECT * FROM `moderation` WHERE `caseid` = ?', [rows.insertId], async (err, rows) => {
            let embed = new MessageEmbed()
            .setColor("#FAD69E")
            .setTitle("New Mute Entry")
            .setDescription(`Perp: ${member} (${member.id})\nModerator: ${message.author} (${message.author.id})\nReason: ${reason}\nCase ID: \`${rows[0].caseid}\``)
            .setTimestamp() 
            let logch = await client.channels.fetch(config.logging.modlog);  
            logch.send({ embeds: [embed] }); 
        });
    });
}

exports.info = {
    name: "mute",
    description: "See if im alive!",
    aliases: []
}