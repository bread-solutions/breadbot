const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

exports.run = async (client, message, args) => {
    if(!message.member.permissions.has("ADMINISTRATIOR")) return;
    message.delete();

    const button = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setCustomId("supportButton")
        .setLabel("Support")
        .setStyle("PRIMARY")
        .setDisabled(false)
    )
    .addComponents(
        new MessageButton()
        .setCustomId("quesButton")
        .setLabel("Question")
        .setStyle("PRIMARY")
        .setDisabled(false)
    )

    const embed = new MessageEmbed()
    .setColor("#FAD69E")
    .setDescription("**Ticket Panel**\nNeed support? or would like to ask a general question click on the appropriate buttons below. :bread:")

    message.channel.send({embeds: [embed], components: [button]});
}

exports.info = {
    name: "ticketpanel",
    description: "Creates the ticket panel",
    aliases: ["tp"]
}