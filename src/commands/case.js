const { MessageEmbed, MessageActionRow, MessageButton, ButtonInteraction } = require('discord.js');
const config = require('../../config.json');
const fs = require("fs");



exports.run = async (client, message, args, con) => {
    message.delete();
    if(!message.member.permissions.has("VIEW_AUDIT_LOG")) return message.reply({content: `You do not have permission to use this command!`, ephemeral: true});
    if (!args[0]) return message.reply({content: `Please provide a user ID!`, ephemeral: true});
    con.query('SELECT * FROM `moderation` WHERE `caseid` = ?', [args[0]], (err, rows) => {
        if (err) throw err;
        if(rows.length < 1) return message.channel.send({content: `That case does not exist!`, ephemeral: true});
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
        if (message.member.permissions.has("VIEW_AUDIT_LOG")) {
            row.components[0].setDisabled(false);
            row.components[1].setDisabled(false);
        }
            let embed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle(`Case Information - ${rows[0].caseid}`)
            .setDescription(`**Perp:** <@${rows[0].perpid}> (${rows[0].perpid})\n**Moderator:** <@${rows[0].moderator}> (${rows[0].moderator})\n**Action Taken**: ${rows[0].action}\n**Reason:** ${rows[0].reason}`);
            message.channel.send({content: "Here is your file sir 📁", embeds: [embed], components: [row] });
        const filter = (interaction) => {
            if (interaction.user.id === message.author.id) return true;
        }

        const collector = message.channel.createMessageComponentCollector({
            filter,
            max: 1,
            time: 3600000,
        });

        collector.on('end', (ButtonInteraction) => {
            const id = ButtonInteraction.first().customId;
            if (id === "caseOptionsEdit") {
                message.channel.send({content: "Please enter the new reason for this case.", ephemeral: true}).then(msg => {
                    const filter = (message) => {
                        if (message.author.id === message.author.id) return true;
                    }
                    const collector = message.channel.createMessageCollector({
                        filter,
                        max: 1,
                        time: 3600000,
                    });
                    collector.on('collect', (message) => {
                        con.query('UPDATE `moderation` SET `reason` = ? WHERE `caseid` = ?', [message.content, rows[0].caseid], (err, rows) => {
                            if (err) throw err;
                            message.channel.send({content: `Case updated!`, ephemeral: true}).then(msg => { setTimeout(() => msg.channel.bulkDelete(4), 5000); });
                        });
                    });
                })
            } else if (id === "caseOptionsDelete") {
                    let ultChoice = new MessageActionRow().addComponents(
                        new MessageButton()
                        .setCustomId("caseOptionsDeleteConfirm")
                        .setLabel("Yes")
                        .setStyle("SUCCESS")
                        .setDisabled(true)
                    ).addComponents(
                        new MessageButton()
                        .setCustomId("caseOptionsDeleteDeny")
                        .setLabel("No")
                        .setStyle("DANGER")
                        .setDisabled(true)
                    )
                    if (message.member.permissions.has("ADMINISTRATOR")) {
                        ultChoice.components[0].setDisabled(false);
                        ultChoice.components[1].setDisabled(false);
                    }
                    message.channel.send({content: "Are you sure you want to delete this case? This action is irreversible.", components: [ultChoice], ephemeral: true}).then(msg => {
                        const filter = (interaction) => {
                            if (interaction.user.id === message.author.id) return true;
                        }
                        const collector = message.channel.createMessageComponentCollector({
                            filter,
                            max: 1,
                            time: 3600000,
                        });
                        collector.on('end', (ButtonInteraction) => {
                            const id = ButtonInteraction.first().customId;
                            if (id === "caseOptionsDeleteConfirm") {
                                con.query('DELETE FROM `moderation` WHERE `caseid` = ?', [rows[0].caseid], async (err, rows) => {
                                    if (err) throw err;
                                    message.channel.send({content: `Case deleted!`, ephemeral: true}).then(msg => { setTimeout(() => msg.channel.bulkDelete(4), 5000); });
                                    const dataCh = client.channels.cache.get(config.logging.datalog)
                                    if (!dataCh) return console.log("Data channel not found");
                                    const dataEmbed = new MessageEmbed()
                                    .setColor("RED")
                                    .setDescription(`${message.author.tag} deleted a case`)
                                    dataCh.send({embeds: [dataEmbed]});
                                });
                            } else if (id === "caseOptionsDeleteDeny") {
                                message.channel.send({content: `Case deletion cancelled!`, ephemeral: true}).then(msg => { setTimeout(() => msg.channel.bulkDelete(4), 5000); });
                            }
                        });
                    });
                }
            });
        });
}

exports.info = {
    name: "case",
    description: "See if im alive!",
    aliases: []
}