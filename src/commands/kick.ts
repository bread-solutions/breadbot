import { ICommand } from "../backend/interfaces/ICommand";
import { MessageEmbed } from "discord.js";
import config from '../config';
import fs from 'fs';

export const command: ICommand = {
    name: "kick",
    run: async(client, message, args, con) => {
        message.delete();
        if(!message.member?.permissions.has("KICK_MEMBERS")) return message.channel.send({content: `:x: You do not have permission to use this command!`}).then(msg => { setTimeout(() => msg.delete(), 10000); }).catch(err => console.log(err));
        let member = message.mentions.members?.first() || message.guild?.members.cache.get(args[0]);
        if(!member) return message.channel.send({content: `:x: You must provide a member!`}).then(msg => { setTimeout(() => msg.delete(), 10000); }).catch(err => console.log(err));
        if(!member.kickable) return message.channel.send({content: `:x: I do not have permission to kick this member!`}).then(msg => { setTimeout(() => msg.delete(), 10000); }).catch(err => console.log(err));
        let reason = args.slice(1).join(" ");
        if (!reason) reason = "No reason provided";

        con.query(`INSERT INTO moderation (action, perpid, perpusername, reason, modid, modusername, date) VALUES (?, ?, ?, ?, ?, ?, ?)`, ["kick", member.id, member.user.tag, reason, message.author.id, message.author.tag, new Date()], (err: any, result: any) => {
                if(err) throw err;
                member?.kick(reason);
                message.channel.send({ content: `***<:yes_tick:992140251252391956> Successfully kicked ${member}***` });
                con.query(`SELECT * FROM moderation WHERE caseid=${result.insertId}`, async (err: any, rows: any) => {
                    let embed = new MessageEmbed()
                        .setColor("#FAD69E")
                        .setTitle("Moderation Logs - New Kick")
                        .setDescription(`**Perp:** ${member} (${member?.id})\n**Moderator:** ${message.author} (${message.author?.id})\n**Reason:** ${reason}\n**Case ID:** \`${rows[0].caseid}\``)
                        .setTimestamp()
                    let logch = await client.channels.fetch(config.logging_channels.moderation_logs);
                    if (logch?.isText()) {
                        await logch.send({ embeds: [embed] });
                    }
                });
        });
    }
}
