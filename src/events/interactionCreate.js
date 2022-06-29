const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const botConfig = require('../../Botconfig');
const config = botConfig.config

module.exports = async (client, interaction) => {
    if (!interaction.isButton())  return;
    if (interaction.customId == "verifyButton") {
        if (interaction.member.roles.cache.some(role => role.id === config.memberRole)) return console.log("Someone tried to verify twice lol!");
        interaction.member.roles.add(config.memberRole).then(() => {
            interaction.reply({content: "You have been verified!",  ephemeral: true});
        });
    } else if (interaction.customId === "supportButton") {
        let supportID = config.supportrole;
        interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
            type: 'GUILD_TEXT',
            permissionOverwrites: [{
                id: interaction.member.id,
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
            },
            {
                id: interaction.guild.roles.everyone,
                deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
            }, 
            {
                id: supportID,
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
            }]
        }).then(async channel => {
            interaction.reply({content: `Ticket opened! <#${channel.id}>`,  ephemeral: true});
            channel.setParent(config.ticketcategory);
            const supportEmbed = new MessageEmbed()
            .setColor("#FAD69E")
            .setTitle("Support Ticket")
            .setDescription(`${interaction.user} has opened a support ticket!`)
            .setTimestamp()

            const supportButton = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId("supportButtonClose")
                .setLabel("Close")
                .setStyle("DANGER")
            )
            channel.send({embeds: [supportEmbed], components: [supportButton]});
        })
    } else if (interaction.customId === "quesButton") {
        let supportID = config.supportrole;
        interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
            type: 'GUILD_TEXT',
            permissionOverwrites: [{
                id: interaction.member.id,
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
            },
            {
                id: interaction.guild.roles.everyone,
                deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
            }, 
            {
                id: supportID,
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
            }]
        }).then(async channel => {
            interaction.reply({content: `Ticket opened! <#${channel.id}>`,  ephemeral: true});
            channel.setParent(config.ticketcategory);
            const supportEmbed = new MessageEmbed()
            .setColor("#FAD69E")
            .setTitle("Question Ticket")
            .setDescription(`${interaction.user} has a question!`)
            .setTimestamp()

            const supportButton = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId("supportButtonClose")
                .setLabel("Close")
                .setStyle("DANGER")
            )
            channel.send({embeds: [supportEmbed], components: [supportButton]});
        })
    } else if (interaction.customId === "supportButtonClose") {
        const transcript = require("discord-html-transcripts");
        interaction.channel.send({content: `Ticket closing in 5 seconds`});
        const channel = interaction.channel;
        const attactment = await transcript.createTranscript(channel);
        const ticketlogsch = client.channels.cache.get(config.ticketlogs)
        
        const embedLog = new MessageEmbed()
        .setColor("#FAD69E")
        .setTitle("Ticket Closed")
        .setDescription(`${interaction.user} has closed <#${interaction.channel.id}>`)
        .setTimestamp()

        setTimeout(() => {
            interaction.channel.delete();
            ticketlogsch.send({embeds: [embedLog], files: [attactment]});
        }, 5000);
    }
}