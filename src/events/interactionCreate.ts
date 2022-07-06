import { IEvent } from "../backend/interfaces/IEvent";
import { ICommand } from "../backend/interfaces/ICommand";
import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import config from '../config';

export const event: IEvent = {
    name: 'interactionCreate',
    run: async(client, con, interaction) => {
        if(!interaction.isButton) return;

        if (interaction.customId === "verifyButton") {
            if (interaction.member.roles.cache.some((role: { id: any; }) => role.id === config.role_settings.memberRole)) return;
            interaction.member.roles.add(config.role_settings.memberRole).then(() => {
                interaction.reply({content: "You have been verified!", ephimeral: true});
            });
        }
    }
}