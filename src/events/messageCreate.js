const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = async (client, con, message) => {
    if (!message.author) return;
    if (message.author.bot) return;
    //if (message.channel.type == "DM") return;
    const dataCh = await client.channels.fetch(config.logging.datalog)
    if (!dataCh) return console.log("Data channel not found");

    let levels = Math.floor(Math.random() * 6) + 5;
    if (message.attachments.size > 0) {
        levels = levels += 1
    }

    if (message.content.length > 650) {
        levels = levels += 1;
    }

    await con.query(`SELECT * FROM chatlvl WHERE discordId='${message.author.id}'`, async (err, row) => {
        if (err) throw err;
        if (row[0]) {
            let currxp = row[0].xpNum;
            let currlevel = row[0].xplvl;
            let nxtlevel = row[0].xplvl * 300;
            let sqlshii = +currxp + +levels;

            await con.query(`UPDATE chatlvl SET xpNum='${sqlshii}' WHERE discordId='${message.author.id}'`, async(err, rows) => {});
            if (nxtlevel <= row[0].xpNum) {
                await con.query(`UPDATE chatlvl SET xplvl= xplvl + 1 WHERE discordId='${message.author.id}'`, async(err, rows) => {});
                const vlup = new MessageEmbed()
                .setColor("#FAD69E")
                .setDescription(`<a:YA_YA_YA_YA_YA_YA_YAHOO:992050642329813012> ${message.author.username} has leveled up!\nNew level: ${+currlevel + +1}`)
                message.channel.send({ embeds: [vlup] });
            }
        } else {
            await con.query(`INSERT INTO chatlvl (discordId, xplvl, xpNum) VALUES ('${message.author.id}', '1', '0')`, async(err, rows) => {
                if (err) throw err;
                const embedErr = new MessageEmbed()
                .setColor("#FAD69E")
                .setDescription(`**${message.author} was not found in the \`chatlvl\` table adding them now...**`)
                dataCh.send({embeds: [embedErr]});

            });
        }
    });

    await con.query(`SELECT * FROM stickymessages WHERE channelid='${message.channel.id}'`, async (err, row) => {
        if (err) throw err;
        if (row[0]) {
            await message.channel.messages.fetch().then(async msg => {
                await msg.forEach(async m => {
                    if(m.content.includes(row[0].messageTxT)) {
                        await m.delete().catch(err => console.log(err));
                    }
                });
            });
            message.channel.send({ content: `:warning:  __***Sticky Message, Read Before Posting***__ :warning:\n\n${row[0].messageTxT}` });
        };
    });

    const prefix = config.prefix;
    if (!message.content.startsWith(prefix)) return;
    const messageArray = message.content.split(" ");
    const command = messageArray[0];
    const args = messageArray.slice(1);

    const commandFile = client.commands.get(command.slice(prefix.length));
    if (commandFile) commandFile.run(client, message, args, con);
}
