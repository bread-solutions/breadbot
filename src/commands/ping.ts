import { ICommand } from "../backend/interfaces/ICommand";
import { MessageEmbed } from 'discord.js';

export const command: ICommand = {
    name: "ping",
    run: async(client, message, args, con) => {
        message.delete();

        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`**Latency: ${client.ws.ping}ms**`)
        message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 5000));
    }
}
