const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');



exports.run = async (client, message, args, con) => {
    message.delete();
    if(!message.member.permissions.has("ADMINISTRATIOR")) return;
    const stickChannel = message.channel.id;
    const messageText = args.join(" ");
    if (!messageText) return message.reply({content: `Please provide a message to stick!`, ephemeral: true});
    
    await con.query(`SELECT * FROM stickymessages WHERE channelid='${stickChannel}'`, async (err, row) => {
        if (err) throw err;
        if (row[0]) {
            return message.reply({ content: `A sticky already exist for this channel` });
        } else {
            await con.query(`INSERT INTO stickymessages (channelid, messageTxT) VALUES ('${stickChannel}', '${messageText}')`, async (err, rows) => {
                if (err) throw err;
            });
            return message.reply({ content: `Sticky message created`, ephemeral: true });
        }
    });
}

exports.info = {
    name: "createsticky",
    description: "See if im alive!",
    aliases: ["csticky", "cs"]
}