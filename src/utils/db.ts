import { Guild } from "discord.js";
import client, { pool } from "..";
import config from "../config";

export async function checkAllMutes(): Promise<void> {
    const guild: Guild = await client.guilds.fetch(config.guild_id);
    await guild.members.fetch();
    const mutedRole = await guild.roles.fetch(config.role_settings.mutedRole);
    if (!mutedRole) return;
    await pool.query(`SELECT * FROM moderation WHERE action="Mute"`, async (err: any, rows: any) => {
        const getMutedPrePromise = rows.map(async row => row.perpid);
        const mutedMembers = await Promise.all(getMutedPrePromise);
        
    if (mutedMembers.length > 0) {
        const currentTimestmap = new Date();
        for (const member of mutedMembers) {
            const user = await guild.members.fetch(member);
            await pool.query(`SELECT * FROM moderation WHERE perpid=${member} AND action="Mute"`, async (err: any, rows: any) => {
                if (err) throw err;
                if (rows.length > 0) {
                    if(rows[0].muteTime === null) return;
                    const data = JSON.parse(rows[0].roles)
                    const muteTime = new Date(rows[0].muteTime);
                    if (currentTimestmap > muteTime) {
                        await user.roles.remove(mutedRole);
                        await pool.query(`DELETE FROM moderation WHERE perpid=${member} AND action="Mute"`);
                        data.forEach(async (role: string) => {
                            await user.roles.add(role);
                        });
                    }
                }
             });
           }
        }
    });

    setInterval(checkAllMutes, 1000 * 60);
}