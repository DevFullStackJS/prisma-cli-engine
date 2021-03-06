"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./Output/index");
var util_1 = require("./util");
var chalk_1 = require("chalk");
var lodash_1 = require("lodash");
function renderList(items) {
    var maxLength = lodash_1.maxBy(items, '[0].length')[0].length;
    var lines = items.map(function (i) {
        var left = i[0];
        var right = i[1];
        if (!right) {
            return left;
        }
        left = "" + lodash_1.padStart(left, maxLength);
        right = util_1.linewrap(maxLength + 2, right);
        return left + "    " + right;
    });
    return lines.join('\n');
}
// TODO find proper typing for this flow definition: Class<Command<*>>
function buildUsage(command) {
    if (command.usage) {
        return command.usage.trim();
    }
    var cmd = command.id.replace(/:/g, ' ');
    if (!command.args) {
        return chalk_1.default.bold(cmd.trim());
    }
    var args = command.args.map(renderArg);
    return (chalk_1.default.bold(cmd) + " " + args.join(' ')).trim();
}
function renderArg(arg) {
    var name = arg.name.toUpperCase();
    if (arg.required) {
        return "" + name;
    }
    else {
        return "[" + name + "]";
    }
}
var Help = /** @class */ (function () {
    function Help(config, output) {
        this.config = config;
        this.out = output || new index_1.Output(config);
    }
    // TODO: command (cmd: Class<Command<*>>): string {
    Help.prototype.command = function (cmd) {
        var color = this.out.color;
        var flags = Object.keys(cmd.flags || {})
            .map(function (f) { return [f, cmd.flags[f]]; })
            .filter(function (f) { return !f[1].hidden; });
        var args = (cmd.args || []).filter(function (a) { return !a.hidden; });
        var hasFlags = flags.length ? " " + color.green('[flags]') : '';
        var usage = color.bold('Usage:') + " " + this.config.bin + " " + buildUsage(cmd) + hasFlags + "\n";
        return [
            usage,
            cmd.description ? "\n" + color.bold(cmd.description.trim()) + "\n" : '',
            this.renderAliases(cmd.aliases),
            this.renderArgs(args),
            this.renderFlags(flags),
            cmd.help ? "\n" + cmd.help.trim() + "\n" : '',
        ].join('');
    };
    // TODO: commandLine (cmd: Class<Command<*>>): [string, ?string] {
    Help.prototype.commandLine = function (cmd) {
        return [
            buildUsage(cmd),
            cmd.description ? this.out.color.dim(cmd.description) : null,
        ];
    };
    Help.prototype.renderAliases = function (aliases) {
        var _this = this;
        if (!aliases || !aliases.length) {
            return '';
        }
        var a = aliases.map(function (a) { return "  $ " + _this.config.bin + " " + a; }).join('\n');
        return "\n" + this.out.color.green('Aliases:') + "\n" + a + "\n";
    };
    Help.prototype.renderArgs = function (args) {
        var _this = this;
        if (!args.find(function (f) { return !!f.description; })) {
            return '';
        }
        return ('\n' +
            renderList(args.map(function (a) {
                return [
                    a.name.toUpperCase(),
                    a.description ? _this.out.color.dim(a.description) : null,
                ];
            })) +
            '\n');
    };
    // TODO renderFlags (flags: [string, Flag][]): string {
    Help.prototype.renderFlags = function (flags) {
        var _this = this;
        if (!flags.length) {
            return '';
        }
        flags.sort(function (a, b) {
            if (a[1].char && !b[1].char) {
                return -1;
            }
            if (b[1].char && !a[1].char) {
                return 1;
            }
            if (a[0] < b[0]) {
                return -1;
            }
            return b[0] < a[0] ? 1 : 0;
        });
        return ("\n" + this.out.color.green('Flags:') + "\n" +
            renderList(flags.map(function (_a) {
                var name = _a[0], f = _a[1];
                var label = [];
                if (f.char) {
                    label.push("-" + f.char);
                }
                if (name) {
                    label.push(" --" + name);
                }
                var usage = f.parse ? " " + name.toUpperCase() : '';
                var description = f.description || '';
                if (f.required || f.optional === false) {
                    description = "(required) " + description;
                }
                return [
                    " " + label.join(',').trim() + usage,
                    description ? _this.out.color.dim(description) : null,
                ];
            })) +
            '\n');
    };
    return Help;
}());
exports.default = Help;
//# sourceMappingURL=Help.js.map