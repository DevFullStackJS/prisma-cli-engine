import { RunOptions } from './types/common';
import { Output } from './Output/index';
export declare class Config {
    /**
     * Local settings
     */
    mockInquirer?: any;
    out: Output;
    debug: boolean;
    windows: boolean;
    bin: string;
    mock: boolean;
    argv: string[];
    commandsDir: string;
    defaultCommand: string;
    userPlugins: boolean;
    version: string;
    name: string;
    pjson: any;
    /**
     * Paths
     */
    cwd: string;
    home: string;
    root: string;
    definitionDir: string;
    definitionPath: string | null;
    globalPrismaPath: string;
    globalConfigPath: string;
    globalClusterCachePath: string;
    warnings: string[];
    /**
     * Urls
     */
    cloudApiEndpoint: string;
    consoleEndpoint: string;
    __cache: {};
    constructor(options?: RunOptions);
    setOutput(out: Output): void;
    readonly arch: string;
    readonly platform: string;
    readonly userAgent: string;
    readonly dirname: any;
    readonly cacheDir: string;
    readonly requireCachePath: string;
    readonly requestsCachePath: string;
    findConfigDir(): null | string;
    private readPackageJson;
    private setPaths;
    private warn;
    private setDefinitionPaths;
    private getDefinitionPathByGraphQLConfig;
    private getCwd;
    private getHome;
}
