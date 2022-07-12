import { IEvent } from "../backend/interfaces/IEvent";
import { ICommand } from "../backend/interfaces/ICommand";
import { MessageEmbed, TextChannel } from "discord.js";
import config from '../config';

export const event: IEvent = {
    name: 'messageDelete',
    run: async(client, con, message) => {
        if (message.author.bot) return;
        if(message.content.startsWith(config.prefix)) return;

        const logembed = new MessageEmbed()
            .setColor("#FAD69E")
            .setTitle("Audit Log - Message Deleted")
            .setDescription(`A message by **${message.author.tag}** was deleted in **${message.channel.name}**`)
            .addField("Message", message.content)
            .setTimestamp();
        const logchannel = client.channels.cache.get(config.logging_channels.audit_logs);
        (logchannel as TextChannel).send({ embeds: [logembed] });
    }
}
