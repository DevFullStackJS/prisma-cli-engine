import 'source-map-support/register';
import { Output } from '../Output/index';
import { ParsedPlugin, PluginType } from './Manager';
import { Config } from '../Config';
import { CachedPlugin } from './Cache';
import { Arg, Flag } from '../Flags/index';
export interface PluginPathOptions {
    output: Output;
    type: PluginType;
    path: string;
    tag?: string;
}
export interface ParsedTopic {
    id: string;
    name?: string;
    topic?: string;
    description?: string;
    hidden?: boolean;
    group: string;
}
export interface ParsedCommand {
    id: string;
    topic: string;
    command?: string;
    aliases?: string[];
    variableArgs?: boolean;
    args: Arg[];
    flags: {
        [name: string]: Flag<any>;
    };
    description?: string;
    help?: string;
    usage?: string;
    hidden?: boolean;
    default?: boolean;
    group: string;
}
export declare class PluginPath {
    out: Output;
    config: Config;
    path: string;
    type: PluginType;
    tag: string | void;
    constructor(options: PluginPathOptions);
    convertToCached(): Promise<CachedPlugin>;
    undefaultTopic(t: ParsedTopic | {
        default: ParsedTopic;
    } | any): ParsedTopic;
    undefaultCommand(c: ParsedCommand | {
        default: ParsedCommand;
    }): ParsedCommand;
    require(): Promise<ParsedPlugin>;
    parsePjsonTopics(): any;
    transformPjsonTopics(topics: any, prefix?: string): any;
    _transformPjsonTopics(topics: any, prefix?: string): any;
    makeID(o: any): string;
    pjson(): {
        name: string;
        version: string;
    };
    repair(err: Error): Promise<boolean>;
}
