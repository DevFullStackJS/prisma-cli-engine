export declare function compare(...props: any[]): (a: any, b: any) => 1 | 0 | -1;
export declare function wait(ms: number, unref?: boolean): Promise<void>;
export declare function timeout(p: Promise<any>, ms: number): Promise<void>;
export declare function undefault(m: any): any;
export declare function linewrap(length: number, s: string): string;
export declare function getCommandId(argv: string[]): string;
export declare function getRoot(): string;
export declare function filterObject(obj: any, cb: Function): any;
