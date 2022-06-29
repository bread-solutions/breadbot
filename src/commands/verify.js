const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

exports.run = async (client, message, args) => {
    if(!message.member.permissions.has("ADMINISTRATIOR")) return;
    message.delete();
    
    const button = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setCustomId("verifyButton")
        .setLabel("Click Here")
        .setStyle("SUCCESS")
        .setDisabled(false)
    )

    const embed = new MessageEmbed()
    .setColor("#FAD69E")
    .setDescription("**Verification**\nWe want to make sure you are an actual bread supporter. :bread:")

    message.channel.send({embeds: [embed], components: [button]});
}

exports.info = {
    name: "verify",
    description: "Sends the verify panel",
    aliases: []
}