import { ICommand } from "../backend/interfaces/ICommand";
import { ButtonInteraction, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import config from '../config';
import { max } from "moment";

export const command: ICommand = {
    name: "case",
    run: async(client, message, args, con) => {
        message.delete();

        if(!message.member?.permissions.has("VIEW_AUDIT_LOG")) return message.channel.send({content: `:x: You do not have permission to use this command!`}).then(msg => { setTimeout(() => msg.delete(), 10000); }).catch(err => console.log(err));
        if(!args[0]) return message.channel.send({content: `:x: You must provide a case id`}).then(msg => { setTimeout(() => msg.delete(), 10000); }).catch(err => console.log(err));
        con.query(`SELECT * FROM moderation WHERE caseid=${args[0]}`, async (err: any, rows: any) => {
            if (err) throw err;
            if (!rows[0]) return message.channel.send({content: `:x: No case found with that id`}).then(msg => { setTimeout(() => msg.delete(), 10000); }).catch(err => console.log(err));
            let row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId("caseOptionsEdit")
                .setLabel("Edit")
                .setStyle("SUCCESS")
                .setDisabled(true)
            )
            .addComponents(
                new MessageButton()
                .setCustomId("caseOptionsDelete")
                .setLabel("Delete")
                .setStyle("DANGER")
                .setDisabled(true)
            )
                if (message.member?.permissions.has("VIEW_AUDIT_LOG")) {
                    row.components[0].setDisabled(false);
                    row.components[1].setDisabled(false);
                }
                let embed = new MessageEmbed()
                .setColor("GREEN")
                .setTitle(`Case Information - ${rows[0].caseid}`)
                .setDescription(`**Perp:** <@${rows[0].perpid}> (${rows[0].perpid})\n**Moderator:** <@${rows[0].modid}> (${rows[0].modid})\n**Action Taken**: ${rows[0].action}\n**Reason:** ${rows[0].reason}\n**Date:** ${rows[0].date}`);
                message.channel.send({content: "Here is your file sir 📁", embeds: [embed], components: [row] });
            const filter = (interaction: any) => {
                if (interaction.user.id === message.author.id) return true;
            }
            const collector = message.channel.createMessageComponentCollector({
                filter: Boolean,
                max: 1,
                time: 3600000,
            });

            collector.on("end", (interaction: any) => {
                const id = interaction.first().customId;
                if (id === "caseOptionsEdit") {
                    message.channel.send({content: "Please enter the new reason for this case."}).then(msg => {
                        const filter = (message: any) => {
                            if (interaction.user.id === message.author.id) return true;
                        }
                        const collector = message.channel.createMessageCollector({
                            filter: Boolean,
                            max: 1,
                            time: 3600000,
                        });
                        collector.on("collect", (message: any) => {
                            con.query(`UPDATE moderation SET reason='${message.content}' WHERE caseid=${rows[0].caseid}`);
                            message.channel.send({content: "Case updated!"}).then(msg => {
                                setTimeout(() => msg.channel.bulkDelete(4), 5000);
                            }).catch(err => console.log(err));
                        });
                    });
                } else if(id === "caseOptionsDelete") {
                    let ultChoice = new MessageActionRow().addComponents(
                        new MessageButton()
                        .setCustomId("caseOptionsDeleteConfirm")
                        .setLabel("Confirm")
                        .setStyle("DANGER")
                        .setDisabled(true)
                    ).addComponents(
                        new MessageButton()
                        .setCustomId("caseOptionsDeleteCancel")
                        .setLabel("Cancel")
                        .setStyle("SUCCESS")
                        .setDisabled(true)
                    )
                    if (message.member?.permissions.has("ADMINISTRATOR")) {
                        ultChoice.components[0].setDisabled(false);
                        ultChoice.components[1].setDisabled(false);
                    }
                    message.channel.send({content: "Are you sure you want to delete this case?", components: [ultChoice] }).then(msg => {
                        const filter = (interaction: any) => {
                            if (interaction.user.id === message.author.id) return true;
                        }
                        const collector = message.channel.createMessageComponentCollector({
                            filter: Boolean,
                            max: 1,
                            time: 3600000,
                        });

                        collector.on("end", async (interaction: any) => {
                            const id = interaction.first().customId;
                            if (id === "caseOptionsDeleteConfirm") {
                                await con.query(`DELETE FROM moderation WHERE caseid=${rows[0].caseid}`, async (err: any, rows: any) => {
                                    if (err) throw err;
                                    message.channel.send({content: "Case deleted"}).then(msg => {
                                        setTimeout(() => {
                                            if (msg.channel.type === "GUILD_TEXT") msg.channel.bulkDelete(4);
                                        }, 3000);
                                    }).catch(err => console.log(err));
                                    const dataCh = await client.channels.fetch(config.logging_channels.data_logs)
                                    if (!dataCh) return console.log("Data channel not found");
                                    const dataEmbed = new MessageEmbed()
                                    .setColor("RED")
                                    .setDescription(`${message.author.tag} deleted a case`)
                                    if (dataCh?.isText()) {
                                        await dataCh.send({embeds: [dataEmbed]});
                                    }
                                });
                            } else if (id === "caseOptionsDeleteCancel") {
                                message.channel.send({content: "Cancelled"}).then(msg => {
                                    setTimeout(() => msg.delete(), 5000);
                                }).catch(err => console.log(err));
                            }
                        })
                    })

                }
            });
        });
    }
}
