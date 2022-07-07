import { ICommand } from "../backend/interfaces/ICommand";
import { MessageEmbed, TextChannel } from "discord.js";
import config from '../config';
import fs from 'fs';

export const command: ICommand = {
    name: "adduser",
    run: async(client, message, args, con) => {
        message.delete();
        if(!message.member?.permissions.has("MANAGE_MESSAGES")) return message.reply({content: `:x: You do not have permission to use this command!`}).then(msg => { setTimeout(() => msg.delete(), 10000); }).catch(err => console.log(err));
        let member = message.mentions.members?.first() || await message.guild?.members.fetch(args[0]);
        if(!member) return message.channel.send({content: `:x: You must mention a user or provide a user ID!`}).then(msg => { setTimeout(() => msg.delete(), 10000); }).catch(err => console.log(err));

        (message.channel as TextChannel).permissionOverwrites.edit(member.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true }).then(() => {
            message.channel.send({ content: `Added ${member} to ticket` })
        });
    }
}
