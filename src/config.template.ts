
import { IConfig } from "./backend/interfaces/IConfig";

const config: IConfig = {
    token: "TOKEN_HERE",
    prefix: ";",
    guild_id: "GUILD_ID_HERE",
    debug: false,

    role_settings: {
        memberRole: "ID_HERE",
        mutedRole: "ID_HERE",
        supportRole: ["ID_HERE"],
    },

    logging_channels: {
        data_logs: "ID_HERE",
        moderation_logs: "ID_HERE",
        ticket_logs: "ID_HERE", 
        audit_logs: "ID_HERE",
        member_count: "ID_HERE",
        welcome_channel: "ID_HERE",
    },

    ticket_settings: {
        category: "ID_HERE",
    },

    mysql: {
        host: "127.0.0.1",
        user: "root",
        password: "",
        database: "breadbot",
    }
}

export default config;
