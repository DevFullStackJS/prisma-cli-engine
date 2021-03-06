import { Output } from '../Output/index';
import { Config } from '../Config';
import { ParsedCommand, ParsedTopic, PluginPath } from './PluginPath';
import Cache, { Group } from './Cache';
export declare type PluginType = 'builtin' | 'core' | 'user' | 'link';
export interface ParsedPlugin {
    topics?: ParsedTopic[];
    commands?: ParsedCommand[];
    groups?: Group[];
}
export declare class Manager {
    out: Output;
    config: Config;
    cache: Cache;
    constructor({ out, config, cache, }: {
        out: Output;
        config: Config;
        cache: Cache;
    });
    list(): Promise<PluginPath[]>;
    handleNodeVersionChange(): Promise<void>;
}
