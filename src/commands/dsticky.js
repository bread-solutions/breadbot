const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');



exports.run = async (client, message, args, con) => {
    message.delete();
    if(!message.member.permissions.has("ADMINISTRATIOR")) return;
    
    const stickChannel = message.channel.id;    
    await con.query(`SELECT * FROM stickymessages WHERE channelid='${stickChannel}'`, async (err, row) => {
        if (err) throw err;
        if (row[0]) {
            await con.query(`DELETE FROM stickymessages WHERE channelid='${stickChannel}'`, async (err, rows) => {
                if (err) throw err;
            });
            return message.reply({ content: `Sticky message removed`, ephemeral: true }); 
        } else {
            return message.reply({ content: `No sticky in this channel to delete`, ephemeral: true });
        }
    });
}

exports.info = {
    name: "deletesticky",
    description: "See if im alive!",
    aliases: ["dsticky", "ds"]
}