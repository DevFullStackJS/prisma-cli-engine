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
/* tslint:disable */
var path = require("path");
var util_1 = require("../util");
var index_1 = require("../Output/index");
var Plugins_1 = require("../Plugin/Plugins");
var CommandManagerBase = /** @class */ (function () {
    function CommandManagerBase(config) {
        this.config = config;
    }
    CommandManagerBase.prototype.findCommand = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, null];
            });
        });
    };
    CommandManagerBase.prototype.listTopics = function (prefix) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, []];
            });
        });
    };
    CommandManagerBase.prototype.findTopic = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, null];
            });
        });
    };
    CommandManagerBase.prototype.require = function (p) {
        return util_1.undefault(require(p));
    };
    return CommandManagerBase;
}());
exports.CommandManagerBase = CommandManagerBase;
var BuiltinCommandManager = /** @class */ (function (_super) {
    __extends(BuiltinCommandManager, _super);
    function BuiltinCommandManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BuiltinCommandManager.prototype.findCommand = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var builtins, p;
            return __generator(this, function (_a) {
                builtins = {
                    version: 'version',
                    help: 'help',
                };
                p = builtins[id];
                if (p) {
                    p = path.join(__dirname, '../commands', p);
                    return [2 /*return*/, this.require(p)];
                }
                return [2 /*return*/];
            });
        });
    };
    BuiltinCommandManager.prototype.listTopics = function (prefix) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ['version', 'help']];
            });
        });
    };
    return BuiltinCommandManager;
}(CommandManagerBase));
exports.BuiltinCommandManager = BuiltinCommandManager;
var CLICommandManager = /** @class */ (function (_super) {
    __extends(CLICommandManager, _super);
    function CLICommandManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CLICommandManager.prototype.findCommand = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var root, p;
            return __generator(this, function (_a) {
                root = this.config.commandsDir;
                if (!root)
                    return [2 /*return*/];
                try {
                    p = require.resolve(path.join.apply(path, [root].concat(id.split(':'))));
                }
                catch (err) {
                    if (err.code !== 'MODULE_NOT_FOUND')
                        throw err;
                }
                if (p)
                    return [2 /*return*/, this.require(p)];
                return [2 /*return*/];
            });
        });
    };
    return CLICommandManager;
}(CommandManagerBase));
exports.CLICommandManager = CLICommandManager;
// TODO look into this later: https://sourcegraph.com/github.com/heroku/cli-engine/-/blob/src/plugins/index.js#L9:33
// not needed right now
//
var PluginCommandManager = /** @class */ (function (_super) {
    __extends(PluginCommandManager, _super);
    function PluginCommandManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PluginCommandManager.prototype.findCommand = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var out, plugins, foundCommand;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        out = new index_1.Output(this.config);
                        plugins = new Plugins_1.default(out);
                        return [4 /*yield*/, plugins.load()];
                    case 1:
                        _a.sent();
                        foundCommand = plugins.findCommand(id || this.config.defaultCommand || 'help');
                        return [2 /*return*/, foundCommand];
                }
            });
        });
    };
    PluginCommandManager.prototype.findTopic = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var out, plugins;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        out = new index_1.Output(this.config);
                        plugins = new Plugins_1.default(out);
                        return [4 /*yield*/, plugins.load()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, plugins.findTopic(id)];
                }
            });
        });
    };
    return PluginCommandManager;
}(CommandManagerBase));
var Dispatcher = /** @class */ (function () {
    function Dispatcher(config) {
        this.config = config;
        this.managers = [
            new CLICommandManager(config),
            new BuiltinCommandManager(config),
            new PluginCommandManager(config),
        ];
    }
    Dispatcher.prototype.findCommand = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, manager, Command;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!id)
                            return [2 /*return*/, {}];
                        _i = 0, _a = this.managers;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        manager = _a[_i];
                        return [4 /*yield*/, manager.findCommand(id)];
                    case 2:
                        Command = _b.sent();
                        if (Command)
                            return [2 /*return*/, { Command: Command }];
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, {}];
                }
            });
        });
    };
    Dispatcher.prototype.findTopic = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, manager, topic;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!id)
                            return [2 /*return*/, {}
                                // TODO: Fix this hack for "cluster".
                                // Find why cache does not invalidate for cluster command
                            ];
                        // TODO: Fix this hack for "cluster".
                        // Find why cache does not invalidate for cluster command
                        if (id.trim() === 'cluster')
                            return [2 /*return*/, null];
                        _i = 0, _a = this.managers;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        manager = _a[_i];
                        return [4 /*yield*/, manager.findTopic(id)];
                    case 2:
                        topic = _b.sent();
                        if (topic)
                            return [2 /*return*/, topic];
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, null];
                }
            });
        });
    };
    Dispatcher.prototype.listTopics = function (prefix) {
        return __awaiter(this, void 0, void 0, function () {
            var arrs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(this.managers.map(function (m) { return m.listTopics(prefix); }))];
                    case 1:
                        arrs = _a.sent();
                        return [2 /*return*/, arrs.reduce(function (next, res) { return res.concat(next); }, [])];
                }
            });
        });
    };
    Object.defineProperty(Dispatcher.prototype, "cmdAskingForHelp", {
        get: function () {
            for (var _i = 0, _a = this.config.argv; _i < _a.length; _i++) {
                var arg = _a[_i];
                if (['--help', '-h'].includes(arg))
                    return true;
                if (arg === '--')
                    return false;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    return Dispatcher;
}());
exports.Dispatcher = Dispatcher;
//# sourceMappingURL=Dispatcher.js.map