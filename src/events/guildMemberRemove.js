const { MessageEmbed } = require("discord.js");
const config = require('../../config.json');

module.exports = async(client, con, member) => {
    const channel = client.channels.fetch(config.logging.leavelog);
    if (!channel) return console.log("Welcome channel not found");

    const dataCh = client.channels.fetch(config.logging.datalog)
    if (!dataCh) return console.log("Data channel not found");
    
    const masterEmbed = new MessageEmbed();

    masterEmbed.setTitle(`User left the server`);
    masterEmbed.setColor("#FAD69E");
    masterEmbed.setThumbnail(member.user.displayAvatarURL());
    masterEmbed.setDescription(`**User**: ${member.user.tag} (${member.id})\n**Joined**: ${member.joinedAt}`);
    channel.send({embeds: [masterEmbed]});
}