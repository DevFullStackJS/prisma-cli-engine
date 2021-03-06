import 'source-map-support/register';
import { Arg, Flag } from '../Flags/index';
import { Config } from '../Config';
import { Output } from '../Output/index';
import { Manager } from './Manager';
import Plugin from './Plugin';
import { PluginPath } from './PluginPath';
export interface CachedCommand {
    id: string;
    topic: string;
    command?: string;
    aliases?: string[];
    args: Arg[];
    flags: {
        [name: string]: Flag<any>;
    };
    description?: string;
    help?: string;
    usage?: string;
    hidden: boolean;
    variableArgs?: boolean;
    group: string;
}
export interface CachedTopic {
    id: string;
    topic: string;
    description?: string;
    hidden: boolean;
    group: string;
}
export interface CachedPlugin {
    name: string;
    path: string;
    version: string;
    commands: CachedCommand[];
    topics: CachedTopic[];
    groups: Group[];
}
export interface Group {
    key: string;
    name: string;
    deprecated?: boolean;
}
export interface CacheData {
    version: string;
    node_version: string | null;
    plugins: {
        [path: string]: CachedPlugin;
    };
}
export default class Cache {
    static updated: boolean;
    config: Config;
    out: Output;
    private _cache;
    constructor(output: Output);
    initialize(): void;
    clear(): void;
    readonly file: string;
    readonly cache: CacheData;
    plugin(pluginPath: string): CachedPlugin | undefined;
    updatePlugin(pluginPath: string, plugin: CachedPlugin): void;
    deletePlugin(...paths: string[]): void;
    fetch(pluginPath: PluginPath): Promise<CachedPlugin>;
    fetchManagers(...managers: Manager[]): Promise<Plugin[]>;
    save(): void;
}
