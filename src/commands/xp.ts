import { ICommand } from "../backend/interfaces/ICommand";
import { MessageAttachment, MessageEmbed } from "discord.js";

export const command: ICommand = {
    name: "xp",
    run: async(client, message, args, con) => {
        message.delete();
        let UserAvatar,UserId,Username,User,UserTag;
        let bruh = message.mentions.members?.first() || await message.guild?.members.fetch(args[0]);
        if (args[0]) {
            User = bruh;
            UserId =  bruh?.id;
            Username = bruh?.user.username;
            UserAvatar = bruh?.user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 });
            UserTag = bruh?.user.tag;
        } else {
            User = message.author;
            UserId = message.author.id;
            Username = message.author.username;
            UserAvatar = message.author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 });
            UserTag = message?.author.tag;
        }

        await con.query(`SELECT * FROM users WHERE clientid=${UserId}`, async (err: any, rows: any) => {
                 if (err) throw err;
                if(rows[0]) {
                    const embed = new MessageEmbed()
                        .setColor("#FAD69E")
                        .setDescription(`**${UserTag} is currently level \`${rows[0].lvl}\`\n\`${rows[0].xp}/${rows[0].lvl * 300}\` away from leveling up!**`)
                    message.channel.send({ embeds: [embed] });
                }
        });
    }
}
