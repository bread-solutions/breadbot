import { IEvent } from "../backend/interfaces/IEvent";
import { checkAllMutes } from "../utils/db";

export const event: IEvent = {
    name: 'ready',
    run: async(client, pool, ready) => {
        console.log("Online")
        checkAllMutes();
    }
}