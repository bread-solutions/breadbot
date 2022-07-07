import { ICommand } from "../backend/interfaces/ICommand";
import { MessageEmbed } from "discord.js";
import config from '../config';
import fs from 'fs';

export const command: ICommand = {
    name: "unmute",
    run: async(client, message, args, con) => {
        message.delete();
        if(!message.member?.permissions.has("KICK_MEMBERS")) return message.reply({content: `:x: You do not have permission to use this command!`}).then(msg => { setTimeout(() => msg.delete(), 10000); }).catch(err => console.log(err));
        let member = message.mentions.members?.first() || await message.guild?.members.fetch(args[0]);
        if(!member) return message.reply({content: `:x: You must mention a user or provide a user ID!`}).then(msg => { setTimeout(() => msg.delete(), 10000); }).catch(err => console.log(err));
            con.query(`SELECT * FROM moderation WHERE perpid=${member.id}`, async (err: any, rows: any) => {
                if (rows.length < 0) return message.channel.send({ content: `:x: ${member} is not muted!`});
                var parsed_data = JSON.parse(rows[0].roles);
                parsed_data = JSON.parse(rows[0].roles);
                parsed_data.forEach(async r => {
                    await member?.roles.add(r);
                });
                member?.roles.remove(config.role_settings.mutedRole);
                con.query(`DELETE FROM moderation WHERE perpid=${member?.id} AND action="Mute"`);


                let embed = new MessageEmbed()
                    .setColor("#FAD69E")
                    .setTitle("New UnMute Entry")
                    .setDescription(`Perp: ${member} (${member?.id})\nModerator: ${message.author} (${message.author.id})\nDate: ${new Date}`)
                    .setTimestamp() 
                let logch = await client.channels.fetch(config.logging_channels.moderation_logs);
                if (logch?.isText()) {
                    await logch.send({ embeds: [embed] });
                } 
            });
    }
}
