import { ICommand } from "../backend/interfaces/ICommand";
import { MessageAttachment, MessageEmbed } from "discord.js";
import config from '../config';
import Canvas from 'canvas';
import  { registerFont, createCanvas } from 'canvas';

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

        registerFont('./src/backend/files/ChronicaPro-Black.ttf', { family: 'ChronicaPro-Black' })
        const applyText = (canvas: any, text: string) => {
            const ctx = canvas.getContext('2d');
            let fontSize = 70;
            do {
                ctx.font = `${fontSize -= 10}px ChronicaPro-Black`;
            } while (ctx.measureText(text).width > canvas.width - 300);
            return ctx.font;
        }

        await con.query(`SELECT * FROM users WHERE clientid=${UserId}`, async (err: any, rows: any) => {
                if (err) throw err;
               if(rows[0]) {
                const canvas = createCanvas(700, 250);
                const ctx = canvas.getContext('2d');
                const background = await Canvas.loadImage(config.canvas_settings.xp_background);
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                ctx.strokeStyle = 'rgba(0,0,0,0.0)';
                ctx.strokeRect(0, 0, canvas.width, canvas.height);
                ctx.font = '24px ChronicaPro-Black';
                ctx.fillStyle = config.canvas_settings.xp_colors;
                ctx.fillText(`${Username}- Lvl ${rows[0].lvl},`, canvas.width / 2.5, canvas.height / 2.5);
                ctx.font = '24px ChronicaPro-Black';
                ctx.fillText(`${rows[0].xp}/${rows[0].lvl * 300} from level up!`, canvas.width / 2.5, canvas.height / 1.3);
                ctx.font = applyText(canvas, `${Username}`)
                ctx.fillStyle = config.canvas_settings.xp_colors;
                ctx.fillText(`${rows[0].xp} XP`, canvas.width / 2.5, canvas.height / 1.6);
                ctx.beginPath();
                ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.clip();
                const avatar = await Canvas.loadImage(UserAvatar);
                ctx.drawImage(avatar, 25, 25, 200, 200);

                const attachment = new MessageAttachment(canvas.toBuffer(), 'xp.gif');
                message.channel.send({ files: [attachment] });
               } else {
                    await con.query('INSERT INTO `users` (`clientid`, `username`, `lvl`, `xp`) VALUES (?, ?, ?, ?)', [UserId, UserTag, "1", "0"], (err: any, rows: any) => {});
                    const embed = new MessageEmbed()
                        .setDescription(`**${User} was not found in the database. They where just added please run the command again**`)
                        .setColor("GREEN")
                    message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 3000));
               }
        });
    }
}
