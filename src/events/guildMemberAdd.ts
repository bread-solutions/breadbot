import { TextChannel } from "discord.js";
import { IEvent } from "../backend/interfaces/IEvent";
import config from "../config";
import { memberChannelCount } from "../utils/functions";

export const event: IEvent = {
    name: 'guildMemberAdd',
    run: async(client, pool, member) => {
        const messages = [
            `${member} just got hired!`,
            `${member} joined the party.`,
            `${member} is here to kick butt and chew bubblegum.`,
            `${member} just landed.`,
            `${member} just joined. Everyone, look busy!`,
            `${member} just showed up.`,
            `${member} hopped into the server`,
            `${member} finally arrived.`,
            `${member} is here.`,
            `${member} fuck you but`
        ];

        const channel = await client.channels.fetch(config.logging_channels.welcome_channel);
        if (!channel) return console.log("Welcome channel not found");

        const randomMessage = Math.floor(Math.random() * messages.length);
        (channel as TextChannel).send(messages[randomMessage] + ` Welcome to ${member.guild.name} :bread:`);
    }
}