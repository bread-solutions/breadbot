import { IEvent } from "../backend/interfaces/IEvent";
import { ICommand } from "../backend/interfaces/ICommand";
import { MessageEmbed, MessageActionRow, MessageButton, Modal, TextInputComponent, ModalActionRowComponent } from "discord.js";
import config from '../config';
import { createTranscript } from 'discord-html-transcripts';

export const event: IEvent = {
    name: 'interactionCreate',
    run: async(client, con, interaction) => {
        if(!interaction.isButton) return;

        if (interaction.customId === "verifyButton") {
            if (interaction.member.roles.cache.some((role: { id: any; }) => role.id === config.role_settings.memberRole)) return;
            interaction.member.roles.add(config.role_settings.memberRole).then(() => {
                //interaction.reply({content: "You have been verified!", ephimeral: true});
            });
        } else if (interaction.customId === "TicketOpen") {
                interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
                    type: "GUILD_TEXT",
                    permissionOverwrites: [{
                        id: interaction.member.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],

                    },
                    {
                        id: interaction.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: interaction.guild.roles.cache.find((role: { id: any; }) => role.id === config.role_settings.supportRole),
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                    }]
                }).then(async (channel) => {
                    interaction.deferReply({ content: `Ticket opened by ${interaction.user.username}`, ephemeral: true });
                    channel.setParent(config.ticket_settings.category);
                    const embed46 = new MessageEmbed()
                        .setColor("#FAD69E")
                        .setTitle(`Ticket opened by ${interaction.user.username}`)
                        .setDescription(`Thank you for opening a ticket please wait for a member of our support staff!`)
                    const embed47 = new MessageActionRow().addComponents(
                        new MessageButton()
                            .setCustomId("closeButton")
                            .setLabel("Close")
                            .setStyle("DANGER")
                    )
                channel.send({embeds: [embed46], components: [embed47]});
            })
        } else if (interaction.customId === "closeButton") {
            interaction.channel.send({ content: `Ticket closing in 5 seconds` });
            const channel = interaction.channel;
            const attachment = await createTranscript(channel);
            const ticketlogch = await client.channels.fetch(config.logging_channels.ticket_logs);

            const embedlog = new MessageEmbed()
                .setColor("#FAD69E")
                .setTitle(`Ticket closed by ${interaction.user.username}`)
                .setTimestamp()

            setTimeout(() => {
                interaction.channel.delete();
                if (ticketlogch?.isText()) {
                    ticketlogch.send({ embeds: [embedlog], files: [attachment] });
                }   
            }, 5000)
        }
    }
}