import Client from '../../index';
import { ClientEvents } from 'discord.js';
import pool from '../../index';


interface Run { 
    (client: typeof Client, con: typeof pool, ...args: any[]): Promise<void>;
}

export interface IEvent {
    name: keyof ClientEvents;
    run: Run;
}

export default IEvent;