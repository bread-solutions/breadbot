import { IEvent } from "../backend/interfaces/IEvent";
import { ICommand } from "../backend/interfaces/ICommand";
import { MessageEmbed, TextChannel } from "discord.js";
import config from '../config';

export const event: IEvent = {
    name: 'messageUpdate',
    run: async(client, con, message, newMessage) => {
        if (message.author.bot) return;
        if(message.content.startsWith(config.prefix) || message.content === newMessage.content) return;


        const logembed = new MessageEmbed()
            .setColor("#FAD69E")
            .setTitle("Audit Log - Message Edited")
            .setDescription(`**${message.author.tag}** edited a message in **${message.channel.name}**`)
            .addField("Message", message.content)
            .addField("New Message", newMessage.content)
            .setTimestamp();
        const logchannel = client.channels.cache.get(config.logging_channels.audit_logs);
        (logchannel as TextChannel).send({ embeds: [logembed] });
    }
}
