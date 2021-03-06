"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ansi = require("ansi-escapes");
var PromptMaskError_1 = require("../errors/PromptMaskError");
var Prompter = /** @class */ (function () {
    function Prompter(out) {
        this.out = out;
    }
    Prompter.prototype.prompt = function (name, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        options = options || {};
        options.name = name;
        options.prompt = name
            ? this.out.color.dim(name + ": ")
            : this.out.color.dim('> ');
        var isTTY = process.env.TERM !== 'dumb' && process.stdin.isTTY;
        return this.out.action.pause(function () {
            if (options.mask || options.hide) {
                if (!isTTY) {
                    return Promise.reject(new PromptMaskError_1.PromptMaskError("CLI needs to prompt for " + (options.name ||
                        options.prompt ||
                        'unknown') + " but stdin is not a tty."));
                }
                return _this.promptMasked(options);
            }
            else {
                return new Promise(function (resolve) {
                    process.stdin.setEncoding('utf8');
                    _this.out.stderr.write(options.prompt || '>');
                    process.stdin.resume();
                    process.stdin.once('data', function (data) {
                        process.stdin.pause();
                        data = data.trim();
                        if (data === '') {
                            resolve(_this.prompt(name, { name: name }));
                        }
                        else {
                            resolve(data);
                        }
                    });
                });
            }
        });
    };
    Prompter.prototype.promptMasked = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var stdin = process.stdin, stderr = process.stderr;
            var input = '';
            stdin.setEncoding('utf8');
            stderr.write(ansi.eraseLine);
            stderr.write(ansi.cursorLeft);
            _this.out.stderr.write(options.prompt || '>');
            stdin.resume();
            stdin.setRawMode(true);
            function stop() {
                if (!options.hide) {
                    stderr.write(ansi.cursorHide +
                        ansi.cursorLeft +
                        options.prompt +
                        input.replace(/./g, '*') +
                        '\n' +
                        ansi.cursorShow);
                }
                else {
                    stderr.write('\n');
                }
                stdin.removeListener('data', fn);
                stdin.setRawMode(false);
                stdin.pause();
            }
            function enter() {
                if (input.length === 0) {
                    return;
                }
                stop();
                resolve(input);
            }
            function ctrlc() {
                reject(new Error('SIGINT'));
                stop();
            }
            function backspace() {
                if (input.length === 0) {
                    return;
                }
                input = input.substr(0, input.length - 1);
                stderr.write(ansi.cursorBackward(1));
                stderr.write(ansi.eraseEndLine);
            }
            function newchar(c) {
                input += c;
                stderr.write(options.hide ? '*'.repeat(c.length) : c);
            }
            function fn(c) {
                switch (c) {
                    case '\u0004': // Ctrl-d
                    case '\r':
                    case '\n':
                        return enter();
                    case '\u0003': // Ctrl-c
                        return ctrlc();
                    default:
                        // backspace
                        if (c.charCodeAt(0) === 127) {
                            return backspace();
                        }
                        else {
                            return newchar(c);
                        }
                }
            }
            stdin.on('data', fn);
        });
    };
    return Prompter;
}());
exports.default = Prompter;
//# sourceMappingURL=Prompter.js.map