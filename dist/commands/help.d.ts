import 'source-map-support/register';
import { Command } from '../Command';
import Plugins from '../Plugin/Plugins';
export declare function renderList(items: string[][], globalMaxLeftLength?: number): string;
export default class Help extends Command {
    static topic: string;
    static description: string;
    static variableArgs: boolean;
    static allowAnyFlags: boolean;
    plugins: Plugins;
    run(): Promise<void>;
    topics(ptopics?: any[] | null, id?: string | null, offset?: number): Promise<void>;
    listCommandsHelp(topic: string, commands: Array<typeof Command>): void;
}
