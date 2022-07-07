import { ICommand } from "../backend/interfaces/ICommand";
import { MessageEmbed } from "discord.js";
import config from '../config';
import fs from 'fs';

export const command: ICommand = {
    name: "msg",
    run: async(client, message, args, con) => {
        message.delete();
        if(!message.member?.permissions.has("MANAGE_MESSAGES")) return message.reply({content: `:x: You do not have permission to use this command!`}).then(msg => { setTimeout(() => msg.delete(), 10000); }).catch(err => console.log(err));
        let msgEcho = args.slice(1).join(" ");
        let member = message.mentions.members?.first();
        if (!msgEcho) return message.reply({content: `:x: You must provide a message!`}).then(msg => { setTimeout(() => msg.delete(), 10000); }).catch(err => console.log(err));
        if (!member) return message.reply({content: `:x: You must provide a member!`}).then(msg => { setTimeout(() => msg.delete(), 10000); }).catch(err => console.log(err));
        member.send(`${msgEcho}\n\n**Sent By Moderation**`);
    }
}
