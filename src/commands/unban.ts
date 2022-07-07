import { ICommand } from "../backend/interfaces/ICommand";
import { MessageEmbed } from "discord.js";
import config from '../config';
import fs from 'fs';

export const command: ICommand = {
    name: "unban",
    run: async(client, message, args, con) => {
        message.delete();
        if(!message.member?.permissions.has("KICK_MEMBERS")) return message.channel.send({content: `:x: You do not have permission to use this command!`}).then(msg => { setTimeout(() => msg.delete(), 10000); }).catch(err => console.log(err));
        let member = args[0];
        if(!member) return message.channel.send({content: `:x: You must provide a member!`}).then(msg => { setTimeout(() => msg.delete(), 10000); }).catch(err => console.log(err));

       try {
        await message.guild?.bans.fetch().then(az => {
            az.forEach(c => {
                if (c.user.id === member) {
                    message.guild?.members.unban(member).then(() => {
                        message.channel.send({content: `***:white_check_mark: Successfully unbanned ${c.user.tag}***`})
                    }).catch(err => console.log(err));
                }
            })
        })
        await con.query(`DELETE FROM moderation WHERE perpid=${member} AND action="Ban`);
            let embed = new MessageEmbed()
                .setColor("#FAD69E")
                .setTitle("Moderation Logs - New Unban")
                .setDescription(`**Perp:** ${member}\n**Moderator:** ${message.author} (${message.author?.id})`)
                .setTimestamp()
          let logch = await client.channels.fetch(config.logging_channels.moderation_logs);
          if (logch?.isText()) {
             await logch.send({ embeds: [embed] });
          }
       } catch (e) {

       }
    }
}
