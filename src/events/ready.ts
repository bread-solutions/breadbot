import { IEvent } from "../backend/interfaces/IEvent";
import { checkAllMutes } from "../utils/db";
import { memberChannelCount } from "../utils/functions";

export const event: IEvent = {
    name: 'ready',
    run: async(client, pool, ready) => {
        console.log("Online")
        checkAllMutes();
        memberChannelCount();
    }
}