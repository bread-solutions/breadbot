module.exports = async(client, member) => {
    //welcome message
    const channel = client.channels.cache.get(config.welcomeChannel);
    if (!channel) return console.log("Welcome channel not found");
    channel.send(`${member} just got hired! Welcome to ${member.guild.name} :bread:`);
}