import { IEvent } from "../backend/interfaces/IEvent";

export const event: IEvent = {
    name: 'ready',
    run: async(client, pool, ready) => {
        console.log("Online")
    }
}