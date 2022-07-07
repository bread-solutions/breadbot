import { IEvent } from "../backend/interfaces/IEvent";
import { ICommand } from "../backend/interfaces/ICommand";
import { MessageEmbed, TextChannel } from "discord.js";
import config from '../config';

export const event: IEvent = {
    name: 'messageCreate',
    run: async(client, con, message) => {
        if (message.author.bot) return;
        if (message.channel.type === "dm") return;

        const dataLog = await client.channels.fetch(config.logging_channels.data_logs);
        await con.query(`SELECT * FROM users WHERE clientid=${message.author.id}`, async (err: any, rows: any) => {
            if (err) throw err;
            if (!rows[0]) {
               await con.query('INSERT INTO `users` (`clientid`, `username`, `lvl`, `xp`) VALUES (?, ?, ?, ?)', [message.author.id, message.author.tag, "1", "0"], (err: any, rows: any) => {});
                const embed = new MessageEmbed()
                    .setDescription(`**${message.author} was not found in the database. Adding them now**`)
                    .setColor("GREEN")
                if (dataLog?.isText()) {
                    await dataLog.send({ embeds: [embed] });
                }
            } else {
                let levels = Math.floor(Math.random() * 6) + 5;
                let currxp = rows[0].xp;
                let currlvl = rows[0].lvl;
                let nxtLvl = currlvl * 300;
                let difference = +currxp + +levels;
                await con.query(`UPDATE users SET xp=${difference} WHERE clientid=${message.author.id}`, (err: any, rows: any) => {});
                if (nxtLvl <= rows[0].xp) {
                    await con.query(`UPDATE users SET lvl=${+currlvl + +1} WHERE clientid=${message.author.id}`, (err: any, rows: any) => {});
                    const vlup = new MessageEmbed()
                    .setColor("#FAD69E")
                    .setDescription(`<a:YA_YA_YA_YA_YA_YA_YAHOO:992050642329813012> ${message.author.username} has leveled up!\nNew level: **${+currlvl + +1}**`)
                    message.channel.send({ embeds: [vlup] });
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