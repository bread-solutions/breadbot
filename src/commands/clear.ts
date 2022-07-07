import { ICommand } from "../backend/interfaces/ICommand";
import { MessageEmbed } from "discord.js";
import config from '../config';
import fs from 'fs';

export const command: ICommand = {
    name: "clear",
    run: async(client, message, args, con) => {
        message.delete();
        if(!message.member?.permissions.has("MANAGE_MESSAGES")) return message.reply({content: `:x: You do not have permission to use this command!`}).then(msg => { setTimeout(() => msg.delete(), 10000); }).catch(err => console.log(err));
        let clearNum = +args[0] + +1;

        if(!clearNum) return message.channel.send({content: `:x: You must provide a number!`}).then(msg => { setTimeout(() => msg.delete(), 10000); }).catch(err => console.log(err));
        if(isNaN(clearNum)) return message.channel.send({content: `:x: You must provide a number!`}).then(msg => { setTimeout(() => msg.delete(), 10000); }).catch(err => console.log(err));
        if(clearNum < 1) return message.channel.send({content: `:x: You must provide a number greater than 0!`}).then(msg => { setTimeout(() => msg.delete(), 10000); }).catch(err => console.log(err));
        if(clearNum >= 100) return message.channel.send({content: `:x: You must provide a number less than 100!`}).then(msg => { setTimeout(() => msg.delete(), 10000); }).catch(err => console.log(err));

        if (message.channel.type === "GUILD_TEXT") message.channel.bulkDelete(clearNum).then(() => {
            message.channel.send({ content: `***<:yes_tick:992140251252391956> Successfully cleared ${clearNum} message(s)***` })
        });
    }
}
