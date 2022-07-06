import { ICommand } from "../backend/interfaces/ICommand";
import { MessageEmbed, MessageButton, MessageActionRow } from 'discord.js';

export const command: ICommand = {
    name: "verifypanel",
    run: async(client, message, args, con) => {
        message.delete();
        if(!message.member?.permissions.has("ADMINISTRATOR")) return;
    
        const button = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId("verifyButton")
            .setLabel("Click Here")
            .setStyle("SUCCESS")
            .setDisabled(false)
        )
    
        const embed = new MessageEmbed()
        .setColor("#FAD69E")
        .setDescription("**Verification**\nWe want to make sure you are an actual bread supporter. :bread:")
    
        message.channel.send({embeds: [embed], components: [button]});
    }
}
