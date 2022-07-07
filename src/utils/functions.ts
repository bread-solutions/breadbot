import { Guild } from "discord.js";
import client from "..";
import config from "../config";

export async function memberChannelCount(): Promise<void> {
    const update = async (guild: Guild): Promise<void> => {
        const chan = await client.channels.fetch(config.logging_channels.member_count);
        (chan as any).setName(`Bread Kids: ${guild.memberCount.toLocaleString()}`);
    }

    client.on("guildMemberAdd", async (member) => update(member.guild));
    client.on("guildMemberRemove", async (member) => update(member.guild));

    const guild: Guild = await client.guilds.fetch(config.guild_id);
    update(guild);
}