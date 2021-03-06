"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
var screen_1 = require("../Output/actions/screen");
var util_1 = require("../util");
var Command_1 = require("../Command");
var Plugins_1 = require("../Plugin/Plugins");
var chalk_1 = require("chalk");
var lodash_1 = require("lodash");
var debug = require('debug')('help command');
function trimToMaxLeft(n) {
    var max = Math.floor(screen_1.stdtermwidth * 0.8);
    return n > max ? max : n;
}
function maxLength(items) {
    return items.reduce(function (acc, curr) { return Math.max(acc, curr.length); }, -1);
}
function renderList(items, globalMaxLeftLength) {
    var maxLeftLength = globalMaxLeftLength || maxLength(items.map(function (i) { return i[0]; })) + 2;
    return items
        .map(function (i) {
        var left = "  " + i[0];
        var right = i[1];
        if (!right) {
            return left;
        }
        left = "" + lodash_1.padStart(left, maxLeftLength);
        right = util_1.linewrap(maxLeftLength + 2, right);
        return left + "  " + right;
    })
        .join('\n');
}
exports.renderList = renderList;
var Help = /** @class */ (function (_super) {
    __extends(Help, _super);
    function Help() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Help.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var commandFinder, argv, firstCommandIndex, cmd, secondCommand, topic, matchedCommand, cmds, subtopics;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.plugins = new Plugins_1.default(this.out);
                        return [4 /*yield*/, this.plugins.load()];
                    case 1:
                        _a.sent();
                        commandFinder = function (arg) { return !['help', '-h', '--help'].includes(arg); };
                        argv = this.config.argv.slice(1);
                        firstCommandIndex = argv.findIndex(commandFinder);
                        cmd = argv[firstCommandIndex];
                        if (argv.length > firstCommandIndex + 1) {
                            secondCommand = argv
                                .slice(1)
                                .slice(firstCommandIndex)
                                .find(commandFinder);
                            if (secondCommand) {
                                cmd = argv[firstCommandIndex] + ":" + secondCommand;
                            }
                        }
                        debug("argv", argv);
                        debug("cmd", cmd);
                        if (!cmd) {
                            return [2 /*return*/, this.topics()];
                        }
                        return [4 /*yield*/, this.plugins.findTopic(cmd)];
                    case 2:
                        topic = _a.sent();
                        return [4 /*yield*/, this.plugins.findCommand(cmd)];
                    case 3:
                        matchedCommand = _a.sent();
                        if (!topic && !matchedCommand) {
                            throw new Error("command " + cmd + " not found");
                        }
                        if (matchedCommand) {
                            this.out.log(matchedCommand.buildHelp(this.config));
                        }
                        if (!topic) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.plugins.commandsForTopic(topic.id)];
                    case 4:
                        cmds = _a.sent();
                        return [4 /*yield*/, this.plugins.subtopicsForTopic(topic.id)];
                    case 5:
                        subtopics = _a.sent();
                        if (!(subtopics && subtopics.length)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.topics(subtopics, topic.id, topic.id.split(':').length + 1)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        if (cmds && cmds.length > 0 && cmds[0].command) {
                            this.listCommandsHelp(cmd, cmds);
                        }
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Help.prototype.topics = function (ptopics, id, offset) {
        if (ptopics === void 0) { ptopics = null; }
        if (id === void 0) { id = null; }
        if (offset === void 0) { offset = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var color, topics, groupedTopics, jobs, _i, _a, group, groupTopics, list, name_1, globalMaxLeft;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        color = this.out.color;
                        this.out.log("\nPrisma replaces traditional ORMs (" + chalk_1.default.underline('https://www.prisma.io') + ")\n    \n" + chalk_1.default.bold('Usage:') + " " + chalk_1.default.bold('prisma') + " COMMAND");
                        topics = (ptopics || this.plugins.topics).filter(function (t) {
                            if (!t.id) {
                                return;
                            }
                            var subtopic = t.id.split(':')[offset];
                            return !t.hidden && !subtopic;
                        });
                        groupedTopics = lodash_1.groupBy(topics, function (topic) { return topic.group; });
                        jobs = [];
                        _i = 0, _a = this.plugins.groups;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        group = _a[_i];
                        groupTopics = groupedTopics[group.key];
                        // const list = groupTopics.map(t => [
                        //   t.id,
                        //   t.description ? chalk.dim(t.description) : null,
                        // ])
                        if (!groupTopics) {
                            return [3 /*break*/, 3];
                        }
                        return [4 /*yield*/, Promise.all(groupTopics.map(function (t) { return __awaiter(_this, void 0, void 0, function () {
                                var cmds;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.plugins.commandsForTopic(t.id)
                                            // console.log(cmds)
                                            // if (t.id === 'cluster') {
                                            //   debugger
                                            // }
                                        ];
                                        case 1:
                                            cmds = _a.sent();
                                            // console.log(cmds)
                                            // if (t.id === 'cluster') {
                                            //   debugger
                                            // }
                                            return [2 /*return*/, cmds
                                                    .filter(function (cmd) { return !cmd.hidden; })
                                                    .map(function (cmd) {
                                                    var cmdName = cmd.command ? " " + cmd.command : '';
                                                    var deprecation = cmd.deprecated ? ' (deprecated)' : '';
                                                    return [
                                                        t.id + cmdName,
                                                        chalk_1.default.dim((cmd.description || t.description) + deprecation),
                                                    ];
                                                })];
                                    }
                                });
                            }); }))];
                    case 2:
                        list = (_b.sent());
                        name_1 = group.deprecated ? group.name + " (deprecated)" : group.name;
                        jobs.push({
                            deprecated: group.deprecated,
                            group: name_1,
                            list: lodash_1.flatten(list),
                        });
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        globalMaxLeft = maxLength(lodash_1.flatten(jobs.map(function (j) { return j.list; })).map(function (i) { return i[0]; })) + 6;
                        jobs.forEach(function (job) {
                            _this.out.log('');
                            var firstLine = chalk_1.default.bold(job.group + ':');
                            var secondLine = renderList(job.list, globalMaxLeft);
                            _this.out.log(job.deprecated ? chalk_1.default.dim(firstLine) : firstLine);
                            _this.out.log(job.deprecated ? chalk_1.default.dim(secondLine) : secondLine);
                        });
                        this.out.log("\nUse " + chalk_1.default.cyan('prisma help [command]') + " for more information about a command.\nDocs can be found here: https://bit.ly/prisma-cli-commands\n\n" + chalk_1.default.dim('Examples:') + "\n\n" + chalk_1.default.gray('-') + " Initialize files for a new Prisma service\n  " + chalk_1.default.cyan('$ prisma init') + "\n\n" + chalk_1.default.gray('-') + " Deploy service changes (or new service)\n  " + chalk_1.default.cyan('$ prisma deploy') + "\n");
                        return [2 /*return*/];
                }
            });
        });
    };
    Help.prototype.listCommandsHelp = function (topic, commands) {
        var _this = this;
        commands = commands.filter(function (c) { return !c.hidden; });
        if (commands.length === 0) {
            return;
        }
        commands.sort(util_1.compare('command'));
        var helpCmd = this.out.color.cmd(this.config.bin + " help " + topic + " COMMAND");
        this.out.log(this.out.color.bold(this.config.bin) + " " + this.out.color.bold(topic) + " commands: (get help with " + helpCmd + ")\n");
        this.out.log(renderList(commands.map(function (c) { return c.buildHelpLine(_this.config); })));
        if (commands.length === 1 && commands[0].help) {
            this.out.log(commands[0].help);
        }
        else {
            this.out.log('');
        }
    };
    Help.topic = 'help';
    Help.description = 'display help';
    Help.variableArgs = true;
    Help.allowAnyFlags = true;
    return Help;
}(Command_1.Command));
exports.default = Help;
//# sourceMappingURL=help.js.map