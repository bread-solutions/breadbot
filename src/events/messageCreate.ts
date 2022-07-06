import { IEvent } from "../backend/interfaces/IEvent";
import { ICommand } from "../backend/interfaces/ICommand";
import { Message } from "discord.js";
import config from '../config';

export const event: IEvent = {
    name: 'messageCreate',
    run: async(client, con, message) => {
        const [rows, fields] = await con.query('INSERT INTO `users` (clientid, username) VALUES (?, ?)', [message.author.id, message.author.username]);

        const prefix = config.prefix;
        if (!message.content.startsWith(prefix)) return;
        const messageArray = message.content.split(" ");
        const command = messageArray[0];
        const args = messageArray.slice(1);

        const commandFile = client.commands.get(command.slice(prefix.length));
        if (commandFile) commandFile.run(client, message, args, con);
    }
}