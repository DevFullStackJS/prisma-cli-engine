"use strict";
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var Config_1 = require("./Config");
var Output_1 = require("./Output");
var Lock_1 = require("./Plugin/Lock");
var Dispatcher_1 = require("./Dispatcher/Dispatcher");
var NotFound_1 = require("./NotFound");
var fs_1 = require("./fs");
var util_1 = require("./util");
var StatusChecker_1 = require("./StatusChecker");
var updateNotifier = require("update-notifier");
var chalk_1 = require("chalk");
var Raven = require("raven");
var os = require("os");
var jwt = require("jsonwebtoken");
var isGlobal_1 = require("./utils/isGlobal");
var CommandReplacedError_1 = require("./errors/CommandReplacedError");
var CommandRemovedError_1 = require("./errors/CommandRemovedError");
Raven.config('https://1e57780fb0bb4b52938cbb3456268121:fc6a6c6fd8cd4bbf81e2cd5c7c814a49@sentry.io/271168').install();
var handleEPIPE = function (err) {
    Raven.captureException(err);
    if (err.code !== 'EPIPE') {
        throw err;
    }
};
var out;
if (!global.testing) {
    process.once('SIGINT', function () {
        if (out) {
            if (out.action.task) {
                out.action.stop(out.color.red('ctrl-c'));
            }
            out.exit(1);
        }
        else {
            process.exit(1);
        }
    });
    var handleErr = function (err) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!out) {
                throw err;
            }
            out.error(err);
            return [2 /*return*/];
        });
    }); };
    process.once('uncaughtException', handleErr);
    process.once('unhandledRejection', handleErr);
    process.stdout.on('error', handleEPIPE);
    process.stderr.on('error', handleEPIPE);
}
process.env.CLI_ENGINE_VERSION = require('../package.json').version;
var CLI = /** @class */ (function () {
    function CLI(_a) {
        var config = (_a === void 0 ? {} : _a).config;
        if (!config) {
            config = {
                mock: false,
            };
        }
        var parentFilename = module.parent.parent
            ? module.parent.parent.filename
            : module.parent.filename;
        if (!config.initPath) {
            config.initPath = parentFilename;
        }
        if (!config.root) {
            var findUp = require('find-up');
            config.root = path.dirname(findUp.sync('package.json', {
                cwd: parentFilename,
            }));
        }
        this.config = new Config_1.Config(config);
        this.notifier = updateNotifier({
            pkg: this.config.pjson,
            updateCheckInterval: 1,
        });
        this.initRaven();
    }
    CLI.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, checker, id, dispatcher, result, plugin, foundCommand, lock, _b, checker, requests, requestsPath, topic, checker, timeout;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        StatusChecker_1.initStatusChecker(this.config);
                        out = new Output_1.Output(this.config);
                        this.config.setOutput(out);
                        if (!this.cmdAskingForHelp) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.Help.run(this.config)];
                    case 1:
                        _a.cmd = _c.sent();
                        checker = StatusChecker_1.getStatusChecker();
                        checker.checkStatus(this.config.argv[1], this.cmd.args, this.cmd.flags, this.cmd.argv);
                        return [3 /*break*/, 12];
                    case 2:
                        id = util_1.getCommandId(this.config.argv.slice(1));
                        // if there is a subcommand, cut the first away so the Parser still works correctly
                        if (this.config.argv[1] &&
                            this.config.argv[1].startsWith('-') &&
                            id !== 'help' &&
                            id !== 'init') {
                            this.config.argv = this.config.argv.slice(1);
                        }
                        dispatcher = new Dispatcher_1.Dispatcher(this.config);
                        return [4 /*yield*/, dispatcher.findCommand(id || this.config.defaultCommand || 'help')
                            // if nothing is found, try again with taking what is before :
                        ];
                    case 3:
                        result = _c.sent();
                        if (!(!result.Command && id && id.includes(':'))) return [3 /*break*/, 5];
                        return [4 /*yield*/, dispatcher.findCommand(id.split(':')[0])];
                    case 4:
                        result = _c.sent();
                        _c.label = 5;
                    case 5:
                        plugin = result.plugin;
                        foundCommand = result.Command;
                        if (!foundCommand) return [3 /*break*/, 8];
                        lock = new Lock_1.default(out);
                        return [4 /*yield*/, lock.unread()
                            // TODO remove this
                        ];
                    case 6:
                        _c.sent();
                        // TODO remove this
                        if (process.env.NOCK_WRITE_RESPONSE_CLI === 'true') {
                            require('nock').recorder.rec({
                                dont_print: true,
                            });
                        }
                        _b = this;
                        return [4 /*yield*/, foundCommand.run(this.config)];
                    case 7:
                        _b.cmd = _c.sent();
                        if (foundCommand.deprecated) {
                            this.cmd.out.log(chalk_1.default.yellow("\nThis command is deprecated and will be removed in 1.9"));
                        }
                        this.setRavenUserContext();
                        checker = StatusChecker_1.getStatusChecker();
                        checker.checkStatus(foundCommand.command ? id : id.split(':')[0], this.cmd.args, this.cmd.flags, this.cmd.argv);
                        if (process.env.NOCK_WRITE_RESPONSE_CLI === 'true') {
                            requests = require('nock').recorder.play();
                            requestsPath = path.join(process.cwd(), 'requests.js');
                            fs_1.default.writeFileSync(requestsPath, requests.join('\n'));
                        }
                        return [3 /*break*/, 12];
                    case 8: return [4 /*yield*/, dispatcher.findTopic(id)];
                    case 9:
                        topic = _c.sent();
                        if (!topic) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.Help.run(this.config)];
                    case 10:
                        _c.sent();
                        checker = StatusChecker_1.getStatusChecker();
                        checker.checkStatus(id, {}, {}, []);
                        return [3 /*break*/, 12];
                    case 11:
                        if (id === 'logs') {
                            throw new CommandReplacedError_1.CommandReplacedError('logs', 'cluster logs');
                        }
                        else if (id === 'push') {
                            throw new CommandReplacedError_1.CommandReplacedError('push', 'deploy');
                        }
                        else if (id === 'seed') {
                            throw new CommandReplacedError_1.CommandReplacedError('seed', 'import');
                        }
                        else if ([
                            'cluster',
                            'cluster:info',
                            'cluster:add',
                            'cluster:remove',
                            'cluster:logs',
                            'cluster:info',
                        ].includes(id)) {
                            throw new CommandRemovedError_1.CommandRemovedError('1.7', 'https://bit.ly/release-notes-1-7', '');
                        }
                        else if ([
                            'local',
                            'local:up',
                            'local:down',
                            'local:start',
                            'local:stop',
                            'local:upgrade',
                            'local:nuke',
                            'local:ps',
                        ].includes(id)) {
                            throw new CommandRemovedError_1.CommandRemovedError('1.7', 'https://bit.ly/release-notes-1-7', 'You can use docker-compose directly to manage the state of a local server.');
                        }
                        else {
                            return [2 /*return*/, new NotFound_1.NotFound(out, this.config.argv).run()];
                        }
                        _c.label = 12;
                    case 12:
                        if (this.notifier.update) {
                            this.notifier.notify({
                                message: 'Update available ' +
                                    chalk_1.default.dim(this.notifier.update.current) +
                                    chalk_1.default.reset(' → ') +
                                    chalk_1.default.cyan(this.notifier.update.latest) +
                                    ("\nRun " + chalk_1.default.bold.cyan('npm i -g prisma') + " to update"),
                                boxenOpts: {
                                    padding: 1,
                                    margin: 1,
                                    align: 'center',
                                    borderColor: 'grey',
                                    borderStyle: 'round',
                                },
                            });
                        }
                        if (!!this.config.argv.includes('playground')) return [3 /*break*/, 14];
                        timeout = require('./util').timeout;
                        return [4 /*yield*/, timeout(this.flush(), 1000)];
                    case 13:
                        _c.sent();
                        out.exit(0);
                        _c.label = 14;
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    CLI.prototype.initRaven = function () {
        Raven.setContext({
            user: {
                fid: StatusChecker_1.getFid(),
                isGlobal: isGlobal_1.getIsGlobal(),
            },
            tags: {
                version: this.config.version,
                platform: os.platform(),
                argv: process.argv.slice(1),
            },
        });
    };
    CLI.prototype.setRavenUserContext = function () {
        if (this.cmd && this.cmd.env && this.cmd.env.cloudSessionKey) {
            var data = jwt.decode(this.cmd.env.cloudSessionKey);
            Raven.mergeContext({
                user: {
                    fid: StatusChecker_1.getFid(),
                    id: data.userId,
                    isGlobal: isGlobal_1.getIsGlobal(),
                },
            });
        }
    };
    CLI.prototype.flush = function () {
        if (global.testing) {
            return Promise.resolve();
        }
        var p = new Promise(function (resolve) { return process.stdout.once('drain', resolve); });
        process.stdout.write('');
        return p;
    };
    Object.defineProperty(CLI.prototype, "cmdAskingForHelp", {
        get: function () {
            for (var _i = 0, _a = this.config.argv; _i < _a.length; _i++) {
                var arg = _a[_i];
                if (['--help', '-h'].includes(arg)) {
                    return true;
                }
                if (arg === '--') {
                    return false;
                }
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CLI.prototype, "Help", {
        get: function () {
            var Help = require('./commands/help').default;
            return Help;
        },
        enumerable: true,
        configurable: true
    });
    return CLI;
}());
exports.CLI = CLI;
function run(_a) {
    var config = (_a === void 0 ? {} : _a).config;
    if (!config) {
        config = {
            mock: false,
        };
    }
    Raven.context(function () {
        var cli = new CLI({ config: config });
        return cli.run();
    });
}
exports.run = run;
//# sourceMappingURL=CLI.js.map