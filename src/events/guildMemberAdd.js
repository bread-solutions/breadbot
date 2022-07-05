const { MessageEmbed } = require("discord.js");
const config = require('../../config.json');

module.exports = async(client, con, member) => {
    const channel = await client.channels.fetch(config.welcomeChannel);
    if (!channel) return console.log("Welcome channel not found");

    const lchannel = await client.channels.fetch(config.logging.joinlog);
    if (!lchannel) return console.log("Logging channel not found");

    const dataCh = await client.channels.fetch(config.logging.datalog)
    if (!dataCh) return console.log("Data channel not found");

    const masterEmbed = new MessageEmbed();

    masterEmbed.setTitle(`User joined the server`);
    masterEmbed.setColor("#FAD69E");
    masterEmbed.setThumbnail(member.user.displayAvatarURL());
    masterEmbed.setDescription(`**User**: ${member.user.tag} (${member.id})\n**Joined**: ${member.joinedAt}`);
    lchannel.send({embeds: [masterEmbed]});

    const messages = [
        `${member} just got hired!`,
        `${member} joined the party.`,
        `${member} is here to kick butt and chew bubblegum.`,
        `${member} just landed.`,
        `${member} just joined. Everyone, look busy!`,
        `${member} just showed up.`,
        `${member} hopped into the server`,
        `${member} finally arrived.`,
        `${member} is here.`,
        `${member} fuck you but`
    ];

    const randomMessage = Math.floor(Math.random() * messages.length);
    channel.send(messages[randomMessage] + ` Welcome to ${member.guild.name} :bread:`);
    const logChannel = await client.channels.fetch(config.logging.newUserLog);
    if (!logChannel) return console.log("New user log channel not found");
}