import { TextChannel } from "discord.js";
import { IEvent } from "../backend/interfaces/IEvent";
import config from "../config";
import { checkAllMutes } from "../utils/db";
import { memberChannelCount } from "../utils/functions";

export const event: IEvent = {
    name: 'guildMemberRemove',
    run: async(client, pool, member) => {
        const channel = await client.channels.fetch(config.logging_channels.welcome_channel);
        if (!channel) return console.log("Welcome channel not found");
        (channel as TextChannel).send(`This bitch ${member} just left the server <:ragebread:994582795139682354>`);
    }
}