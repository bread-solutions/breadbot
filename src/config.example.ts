import { IConfig } from "./backend/interfaces/IConfig";

const config: IConfig = {
    token: "TOKEN_HERE",
    prefix: ";",
    guild_id: "GUILD_ID_HERE",
    debug: false,

    role_settings: {
        memberRole: "MEMBER_ROLE_HERE",
        mutedRole: "MUTED_ROLE_HERE",
        supportRole: "SUPPORT_ROLE_HERE",
    },

    logging_channels: {
        data_logs: "LOG_CHANEL_HERE",
        moderation_logs: "LOG_CHANEL_HERE",
        ticket_logs: "LOG_CHANEL_HERE", 
        audit_logs: "LOG_CHANEL_HERE",
        member_count: "LOG_CHANEL_HERE",
        welcome_channel: "LOG_CHANEL_HERE",
    },

    ticket_settings: {
        category: "CATEGORY_HERE",
    },

    canvas_settings: {
        xp_background: "https://cdn.discordapp.com/attachments/992345747276177488/994579606474600468/unknown.png",
        xp_colors: "#eeeeee",
    },

    mysql: {
        host: "localhost",
        user: "root",
        password: "",
        database: "breadbot",
    }
}

export default config;