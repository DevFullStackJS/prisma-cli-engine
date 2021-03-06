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
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
var Output_1 = require("./Output");
var Config_1 = require("./Config");
var Parser_1 = require("./Parser");
var Help_1 = require("./Help");
var Client_1 = require("./Client/Client");
var prisma_yml_1 = require("prisma-yml");
var packagejson = require("../package.json");
var mock = require("./mock");
var StatusChecker_1 = require("./StatusChecker");
var util_1 = require("./util");
var os = require("os");
var fs = require("fs-extra");
var path = require("path");
var chalk_1 = require("chalk");
var debug = require('debug')('command');
var pjson = packagejson;
var Command = /** @class */ (function () {
    function Command(options) {
        if (options === void 0) { options = { config: { mock: false } }; }
        if (options.config && options.config instanceof Config_1.Config) {
            this.config = options.config;
        }
        else if (options && options.config && options.config.mockConfig) {
            this.config = options.config.mockConfig;
        }
        else {
            this.config = new Config_1.Config(options.config);
        }
        this.out = new Output_1.Output(this.config);
        this.config.setOutput(this.out);
        this.argv = options.config && options.config.argv ? options.config.argv : [];
        this.env = new prisma_yml_1.Environment(this.config.home, this.out, this.config.version);
        this.definition = new prisma_yml_1.PrismaDefinitionClass(this.env, this.config.definitionPath, process.env, this.out);
        this.client = new Client_1.Client(this.config, this.env, this.out);
        // this.auth = new Auth(this.out, this.config, this.env, this.client)
        // this.client.setAuth(this.auth)
    }
    Object.defineProperty(Command, "id", {
        get: function () {
            return this.command ? this.topic + ":" + this.command : this.topic;
        },
        enumerable: true,
        configurable: true
    });
    Command.mock = function () {
        var argv = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            argv[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var customArgs, mockDefinition, mockRC, mockConfig;
            return __generator(this, function (_a) {
                customArgs = null;
                if (typeof argv[0] === 'object') {
                    customArgs = argv.shift();
                }
                argv.unshift('argv0', 'cmd');
                mockDefinition = customArgs && customArgs.mockDefinition
                    ? customArgs.mockDefinition
                    : mock.mockDefinition;
                mockRC = customArgs && customArgs.mockRC ? customArgs.mockRC : null;
                mockConfig = customArgs && customArgs.mockConfig ? customArgs.mockConfig : null;
                debug("Using mockDefinition", mockDefinition);
                debug("Using mockRC", mockRC);
                return [2 /*return*/, this.run({ argv: argv, mock: true, mockDefinition: mockDefinition, mockRC: mockRC, mockConfig: mockConfig })];
            });
        });
    };
    Command.prototype.printServerVersion = function (version) {
        if (version) {
            return os.EOL + "Prisma server version: " + version;
        }
        else {
            return "";
        }
    };
    Command.prototype.printCLIVersion = function () {
        return "Prisma CLI version: " + this.config.userAgent;
    };
    Command.prototype.getVersionTokens = function (v) {
        var tokens = v.replace('-', '.').split('.');
        if (tokens.length < 2) {
            throw new Error("Unable to construct minor version from " + v);
        }
        var stage = 'master';
        stage = tokens.some(function (t) { return t.includes('beta'); }) ? 'beta' : 'master';
        if (stage === 'master') {
            stage = tokens.some(function (t) { return t.includes('alpha'); }) ? 'alpha' : 'master';
        }
        return {
            minorVersion: (tokens[0] + "." + tokens[1]).replace('-alpha', '').replace('-beta', ''),
            stage: stage
        };
    };
    Command.prototype.printVersionSyncWarningMessage = function () {
        return chalk_1.default.yellow(chalk_1.default.bold("Warning: ")) + "Your Prisma server and Prisma CLI are currently out of sync. They should be on the same minor version.";
    };
    Command.prototype.compareVersions = function (v1, v2) {
        var v1Tokens = this.getVersionTokens(v1);
        var v2Tokens = this.getVersionTokens(v2);
        return v1Tokens.minorVersion === v2Tokens.minorVersion && v1Tokens.stage === v2Tokens.stage;
    };
    Command.prototype.areServerAndCLIInSync = function (cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var envFile, server, serverVersion, e_1, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 11, , 12]);
                        envFile = cmd.flags['env-file'];
                        if (!(envFile && !fs.pathExistsSync(path.join(cmd.config.cwd, envFile)))) return [3 /*break*/, 2];
                        return [4 /*yield*/, cmd.out.error("--env-file path '" + envFile + "' does not exist")];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, cmd.definition.load(cmd.flags, envFile)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, cmd.definition.getCluster(false)];
                    case 4:
                        server = _a.sent();
                        if (!server) return [3 /*break*/, 9];
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, server.getVersion()];
                    case 6:
                        serverVersion = _a.sent();
                        return [2 /*return*/, {
                                inSync: this.compareVersions(serverVersion, cmd.config.version),
                                serverVersion: serverVersion
                            }];
                    case 7:
                        e_1 = _a.sent();
                        debug("Failed to fetch server version");
                        debug(e_1.toString());
                        return [2 /*return*/, {
                                inSync: true,
                                serverVersion: null
                            }];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        debug("Failed to get the server");
                        return [2 /*return*/, {
                                inSync: true,
                                serverVersion: null
                            }];
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        e_2 = _a.sent();
                        debug("Failed to get the definition file");
                        debug(e_2.toString());
                        return [2 /*return*/, {
                                inSync: true,
                                serverVersion: null
                            }];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    Command.run = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, _a, inSync, serverVersion, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        cmd = new this({ config: config });
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, cmd.init(config)];
                    case 2:
                        _b.sent();
                        if (!this.printVersionSyncWarning) return [3 /*break*/, 4];
                        return [4 /*yield*/, cmd.areServerAndCLIInSync(cmd)];
                    case 3:
                        _a = _b.sent(), inSync = _a.inSync, serverVersion = _a.serverVersion;
                        if (!inSync) {
                            cmd.out.log(cmd.printVersionSyncWarningMessage() + "\n  \n" + cmd.printCLIVersion() + cmd.printServerVersion(serverVersion) + "\n  \nFor further information, please read: http://bit.ly/prisma-cli-server-sync\n  ");
                        }
                        _b.label = 4;
                    case 4: return [4 /*yield*/, cmd.run()];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, cmd.out.done()];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        err_1 = _b.sent();
                        cmd.out.error(err_1);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/, cmd];
                }
            });
        });
    };
    Command.buildHelp = function (config) {
        var help = new Help_1.default(config);
        return help.command(this);
    };
    Command.buildHelpLine = function (config) {
        var help = new Help_1.default(config);
        return help.commandLine(this);
    };
    Command.prototype.run = function () {
        var rest = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rest[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    Command.prototype.init = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var parser, _a, argv, flags, args;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        parser = new Parser_1.Parser({
                            flags: this.constructor.flags || {},
                            args: this.constructor.args || [],
                            variableArgs: this.constructor.variableArgs,
                            cmd: this,
                        });
                        return [4 /*yield*/, parser.parse({
                                flags: this.flags,
                                argv: this.argv.slice(2),
                            })];
                    case 1:
                        _a = _b.sent(), argv = _a.argv, flags = _a.flags, args = _a.args;
                        this.flags = flags;
                        this.argv = argv;
                        this.args = args;
                        return [4 /*yield*/, this.env.load()];
                    case 2:
                        _b.sent();
                        StatusChecker_1.initStatusChecker(this.config, this.env);
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(Command.prototype, "stdout", {
        get: function () {
            return this.out.stdout.output;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Command.prototype, "stderr", {
        get: function () {
            return this.out.stderr.output;
        },
        enumerable: true,
        configurable: true
    });
    Command.prototype.getSanitizedFlags = function () {
        return util_1.filterObject(this.flags, function (_, value) {
            if (value === undefined) {
                return false;
            }
            return true;
        });
    };
    Command.args = [];
    Command.aliases = [];
    Command.hidden = false;
    Command.allowAnyFlags = false;
    Command.deprecated = false;
    Command.printVersionSyncWarning = false;
    Command.version = pjson.version;
    return Command;
}());
exports.Command = Command;
//# sourceMappingURL=Command.js.map