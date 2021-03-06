import 'source-map-support/register';
import { Arg, Flags } from './Flags/index';
import { Output } from './Output';
import { Config } from './Config';
import { ProjectDefinition, RunOptions } from './types/common';
import { OutputArgs, OutputFlags } from './Parser';
import { Client } from './Client/Client';
import { Environment, PrismaDefinitionClass } from 'prisma-yml';
import { RC } from './types/rc';
export declare class Command {
    static topic: string;
    static group: string;
    static command?: string;
    static description?: string;
    static usage?: string;
    static flags: Flags;
    static args: Arg[];
    static aliases: string[];
    static hidden: boolean;
    static mockDefinition: ProjectDefinition;
    static mockRC: RC;
    static allowAnyFlags: boolean;
    static deprecated?: boolean;
    static printVersionSyncWarning: boolean;
    static readonly id: string;
    static mock(...argv: any[]): Promise<Command>;
    printServerVersion(version: string | null): string;
    printCLIVersion(): string;
    getVersionTokens(v: string): {
        minorVersion: string;
        stage: string;
    };
    printVersionSyncWarningMessage(): string;
    compareVersions(v1: any, v2: any): boolean;
    areServerAndCLIInSync(cmd: Command): Promise<{
        inSync: boolean;
        serverVersion: string | null;
    }>;
    static run(config?: RunOptions): Promise<Command>;
    static buildHelp(config: Config): string;
    static buildHelpLine(config: Config): string[];
    protected static version: any;
    client: Client;
    out: Output;
    config: Config;
    definition: PrismaDefinitionClass;
    env: Environment;
    flags: OutputFlags;
    args?: OutputArgs;
    argv: string[];
    constructor(options?: {
        config?: RunOptions;
    });
    run(...rest: void[]): Promise<void>;
    init(options?: RunOptions): Promise<void>;
    readonly stdout: string;
    readonly stderr: string;
    getSanitizedFlags(): OutputFlags;
}
