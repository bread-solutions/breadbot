import Client from '../../index';
import { Message } from 'discord.js';
import pool from '../../index';

interface Run {
    (client: typeof Client, message: Message, args: string[], con: typeof pool): Promise<void>;
}

export interface ICommand {
    name: string;
    description?: string;
    run: Run;
}

export default ICommand;