import { ICommand } from "../backend/interfaces/ICommand";
import { MessageEmbed, MessageButton, MessageActionRow } from 'discord.js';

export const command: ICommand = {
    name: "ticketpanel",
    run: async(client, message, args, con) => {
        message.delete();
        if(!message.member?.permissions.has("ADMINISTRATOR")) return;
    
        const button = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId("TicketOpen")
            .setLabel("Open Ticket")
            .setStyle("SUCCESS")
            .setDisabled(false)
        )
    
        const embed = new MessageEmbed()
        .setColor("#FAD69E")
        .setDescription("__**Ticket Panel**__\n\nTo open a ticket, click the button below :bread:")
        message.channel.send({embeds: [embed], components: [button]});
    }
}
