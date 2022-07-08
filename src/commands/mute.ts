import { ICommand } from "../backend/interfaces/ICommand";
import { MessageEmbed } from "discord.js";
import config from '../config';
import fs from 'fs';

export const command: ICommand = {
    name: "mute",
    run: async(client, message, args, con) => {
        message.delete();
        if(!message.member?.permissions.has("MANAGE_MESSAGES")) return message.reply({content: `:x: You do not have permission to use this command!`}).then(msg => { setTimeout(() => msg.delete(), 10000); }).catch(err => console.log(err));
        let member = message.mentions.members?.first() || await message.guild?.members.fetch(args[0]);
        if(!member) return message.reply({content: `:x: You must mention a user or provide a user ID!`}).then(msg => { setTimeout(() => msg.delete(), 10000); }).catch(err => console.log(err));
        if(member.permissions.has("MANAGE_MESSAGES")) return message.reply({ content: ":x: You cannot mute a moderator" }).then(msg => { setTimeout(() => msg.delete(), 10000); }).catch(err => console.log(err));
        let reason = args.slice(2).join(" ");
        if(!reason) reason = "No reason provided";
        let mutetime = args[1];
        let allroles = member.roles.cache.map(r => r.id);
        allroles.pop();

        await con.query(`INSERT INTO moderation (action, perpid, perpusername, reason, modid, modusername, date, isActiveMute, roles) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, ["Mute", member.id, member.user.tag, reason, message.author.id, message.author.tag, new Date(), true, JSON.stringify(allroles)], async (err: any, rows: any) => {
            if (!mutetime) {
                if (err) throw err;
                message.channel.send({ content: `***<:yes_tick:992140251252391956> Successfully muted ${member}***`});
                member?.roles.cache.forEach(async role => {
                    if (role.name !== "@everyone") {
                        await member?.roles.remove(role);
                    }
                });
                member?.roles.add(config.role_settings.mutedRole);
            } else {
                var duration = new Date();
                if (mutetime.includes("m")) {
                    if (mutetime < "5") {
                        mutetime = "5m";
                    }
                message.channel.send({ content: `***<:yes_tick:992140251252391956> Successfully muted ${member} for ${mutetime}***`});
                    duration.setMinutes(duration.getMinutes() + parseInt(mutetime.replace("m", "")));
                } else if (mutetime.includes("h")) {
                    duration.setHours(duration.getHours() + parseInt(mutetime.replace("h", "")));
                } else if (mutetime.includes("d")) {
                    duration.setDate(duration.getDate() + parseInt(mutetime.replace("d", "")));
                } else if (mutetime.includes("s")) {
                    duration.setSeconds(duration.getSeconds() + parseInt(mutetime.replace("s", "")));
                }

                await con.query(`SELECT * FROM moderation WHERE perpid=${member?.id} AND action="Mute"`, async (err: any, rows: any) => {
                    await con.query(`UPDATE moderation SET muteTime='${duration}' WHERE perpid=${member?.id} AND action="Mute"`, (err: any, rows: any) => {
                        if (err) throw err;
                        member?.roles.cache.forEach(async role => {
                            if (role.name !== "@everyone") {
                                await member?.roles.remove(role);
                            }
                            member?.roles.add(config.role_settings.mutedRole);
                        })
                    });
                });
            };
            con.query('SELECT * FROM `moderation` WHERE `caseid` = ?', [rows.insertId], async (err, rows) => {
                let embed = new MessageEmbed()
                .setColor("#FAD69E")
                .setTitle("New Mute Entry")
                .setDescription(`Perp: ${member} (${member?.id})\nModerator: ${message.author} (${message.author.id})\nReason: ${reason}\nDate: ${new Date}\nCase ID: \`${rows[0].caseid}\``)
                .setTimestamp() 
                let logch = await client.channels.fetch(config.logging_channels.moderation_logs);
                if (logch?.isText()) {
                    await logch.send({ embeds: [embed] });
                } 
            });

        });

    }
}
