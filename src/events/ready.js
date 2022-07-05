const config = require("../../config.json");

module.exports = async(client, con, ready) => {
    console.log(`${client.user.tag} is online!`);
    //client.user.setActivity(`${client.shard.count}`, {type: "WATCHING"});
    client.user.setPresence({ status: "dnd" })

    const update = async (guild) => {
        const chan = await client.channels.fetch(config.memberCountChannel);
        chan.setName(`${config.memberCountName} ${guild.memberCount.toLocaleString()}`);
    }

    client.on("guildMemberAdd", async (member) => update(member.guild));
    client.on("guildMemberRemove", async (member) => update(member.guild));

    const guild = client.guilds.cache.get(config.guildid);
    update(guild)
}