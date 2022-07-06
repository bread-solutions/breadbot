import { IEvent } from "../backend/interfaces/IEvent";
import { ICommand } from "../backend/interfaces/ICommand";
import { MessageEmbed, TextChannel } from "discord.js";
import config from '../config';

export const event: IEvent = {
    name: 'messageCreate',
    run: async(client, con, message) => {
        if (message.author.bot) return;

        const dataLog = await client.channels.fetch(config.logging_channels.data_logs);
        await con.query(`SELECT * FROM users WHERE clientid=${message.author.id}`, async (err: any, rows: any) => {
            if (err) throw err;
            if (!rows[0]) {
               await con.query('INSERT INTO `users` (`clientid`, `username`) VALUES (?, ?)', [message.author.id, message.author.username], (err: any, rows: any) => {});
                const embed = new MessageEmbed()
                    .setDescription(`**${message.author} was not found in the database. Adding them now**`)
                    .setColor("GREEN")
                if (dataLog?.isText()) {
                    await dataLog.send({ embeds: [embed] });
                }
            }
        });

        const prefix = config.prefix;
        if (!message.content.startsWith(prefix)) return;
        const messageArray = message.content.split(" ");
        const command = messageArray[0];
        const args = messageArray.slice(1);

        const commandFile = client.commands.get(command.slice(prefix.length));
        if (commandFile) commandFile.run(client, message, args, con);
    }
}