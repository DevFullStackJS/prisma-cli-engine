import { ActionBase } from './ActionBase';
import { Output } from '../index';
export declare class SpinnerAction extends ActionBase {
    spinner: any;
    ansi: any;
    frames: any;
    frameIndex: number;
    output: string | null;
    width: number;
    constructor(out: Output);
    _start(): void;
    _stop(): void;
    _pause(icon?: string): void;
    _render(icon?: string): void;
    _reset(): void;
    _frame(): string;
    _lines(s: string): number;
    _write(s: string): void;
}
