import { ICommand } from "../backend/interfaces/ICommand";
import { MessageEmbed } from "discord.js";
import config from '../config';

export const command: ICommand = {
    name: "warn",
    run: async(client, message, args, con) => {
        message.delete();
        if(!message.member?.permissions.has("MANAGE_MESSAGES")) return message.channel.send({content: `:x: You do not have permission to use this command!`}).then(msg => { setTimeout(() => msg.delete(), 10000); }).catch(err => console.log(err));
        let member = message.mentions.members?.first() || await message.guild?.members.fetch(args[0]);
        if(!member) return message.channel.send({content: `:x: You must mention a user or provide a user ID!`}).then(msg => { setTimeout(() => msg.delete(), 10000); }).catch(err => console.log(err));
        if(member.permissions.has("MANAGE_MESSAGES")) return message.channel.send({ content: ":x: You cannot warn a moderator" }).then(msg => { setTimeout(() => msg.delete(), 10000); }).catch(err => console.log(err));
        let reason = args.slice(1).join(" ");
        if(!reason) reason = "No reason provided";

        con.query('INSERT INTO moderation (action, perpid, perpusername, reason, modid, modusername, date) VALUES (?, ?, ?, ?, ?, ?, ?)', ["Warn", member.id, member.user.tag, reason, message.author.id, message.author.tag, new Date()], (err: any, rows: any) => {
            if(err) throw err;
            message.channel.send({ content: `***<:yes_tick:992140251252391956> Successfully warned ${member}***`});
            con.query(`SELECT * FROM moderation WHERE caseid=${rows.insertId}`, async (err: any, rows: any) => {
                let embed = new MessageEmbed()
                    .setColor("#FAD69E")
                    .setTitle("Moderation Logs - New Warn")
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
