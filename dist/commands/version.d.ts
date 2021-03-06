import { Command } from '../Command';
export default class Version extends Command {
    static topic: string;
    static description: string;
    static aliases: string[];
    static printVersionSyncWarning: boolean;
    run(): Promise<void>;
}
