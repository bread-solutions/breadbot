import { ICommand } from "../backend/interfaces/ICommand";
import { MessageEmbed, TextChannel } from "discord.js";
import config from '../config';
import fs from 'fs';

export const command: ICommand = {
    name: "rename",
    run: async(client, message, args, con) => {
        message.delete();
        if(!message.member?.permissions.has("MANAGE_MESSAGES")) return message.reply({content: `:x: You do not have permission to use this command!`}).then(msg => { setTimeout(() => msg.delete(), 10000); }).catch(err => console.log(err));
        let msgEcho = args[0];
        if (!msgEcho) return message.reply({content: `:x: You must provide a new name!`}).then(msg => { setTimeout(() => msg.delete(), 10000); }).catch(err => console.log(err));
        (message.channel as TextChannel).setName(msgEcho);
    }
}
