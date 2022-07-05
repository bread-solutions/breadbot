const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

exports.run = async (client, message, args, con) => {
    let user = message.mentions.members.first() || await message.guild.members.fetch(args[0]);

    await con.query(`SELECT * FROM chatlvl WHERE discordId='${user}'`, async (err, row) => {
        if (err) throw err;
        let lvl = row[0].xplvl;
        let xp = row[0].xpNum;
        let neededXp = lvl * 300;

        const embed = new MessageEmbed()
        .setColor("#FAD69E")
        if(args[0]) {
            embed.setDescription(`The current level of <@${user}> is **${lvl}** and they need **${neededXp - xp}** more xp to level up!`);
        } else {
            embed.setDescription(`${message.author} Your current level is **${lvl}** and you need **${neededXp - xp}** more xp to level up!`);
        }
        message.channel.send({embeds: [embed]});
    });

    setTimeout(function(err) {
        if (err) throw err;
        message.delete();
    }, 5000);
}

exports.info = {
    name: "xp",
    description: "See if im alive!",
    aliases: ["level", "lvl"]
}