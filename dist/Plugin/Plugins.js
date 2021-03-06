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
var uniqby = require("lodash.uniqby");
var Lock_1 = require("./Lock");
var BuiltInPlugins_1 = require("./BuiltInPlugins");
var CorePlugins_1 = require("./CorePlugins");
var Cache_1 = require("./Cache");
var Plugins = /** @class */ (function () {
    function Plugins(output) {
        this.out = output;
        this.config = output.config;
        this.cache = new Cache_1.default(output);
        this.builtin = new BuiltInPlugins_1.default(this);
        // this.linked = new LinkedPlugins(this)
        // this.user = new UserPlugins(this)
        this.core = new CorePlugins_1.default(this);
        this.lock = new Lock_1.default(this.out);
    }
    Plugins.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.loaded) {
                            return [2 /*return*/];
                        }
                        _a = this;
                        return [4 /*yield*/, this.cache.fetchManagers(
                            // this.linked,
                            // this.user,
                            this.core, this.builtin)];
                    case 1:
                        _a.plugins = _b.sent();
                        this.loaded = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(Plugins.prototype, "commands", {
        get: function () {
            var commands = [];
            for (var _i = 0, _a = this.plugins; _i < _a.length; _i++) {
                var plugin = _a[_i];
                try {
                    commands = commands.concat(plugin.commands);
                }
                catch (err) {
                    this.out.warn(err, "error reading plugin " + plugin.name);
                }
            }
            return commands;
        },
        enumerable: true,
        configurable: true
    });
    Plugins.prototype.list = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.load()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.plugins];
                }
            });
        });
    };
    Plugins.prototype.isPluginInstalled = function (name) {
        return !!this.plugins.find(function (p) { return p.name === name; });
    };
    Plugins.prototype.findPluginWithCommand = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, plugin;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0;
                        return [4 /*yield*/, this.list()];
                    case 1:
                        _a = _b.sent();
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        plugin = _a[_i];
                        return [4 /*yield*/, plugin.findCommand(id)];
                    case 3:
                        if (_b.sent()) {
                            return [2 /*return*/, plugin];
                        }
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Plugins.prototype.findCommand = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, plugin, c;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = this.plugins;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        plugin = _a[_i];
                        return [4 /*yield*/, plugin.findCommand(id)];
                    case 2:
                        c = _b.sent();
                        if (c) {
                            return [2 /*return*/, c];
                        }
                        return [2 /*return*/];
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Plugins.prototype.commandsForTopic = function (topic) {
        return __awaiter(this, void 0, void 0, function () {
            var commands;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        commands = this.plugins.reduce(function (t, p) {
                            try {
                                return t.concat(p.commands
                                    .filter(function (c) { return c.topic === topic; })
                                    .map(function (c) { return p.findCommand(c.id); }));
                            }
                            catch (err) {
                                _this.out.warn(err, "error reading plugin " + p.name);
                                return t;
                            }
                        }, []);
                        return [4 /*yield*/, Promise.all(commands)];
                    case 1:
                        commands = _a.sent();
                        return [2 /*return*/, uniqby(commands, 'id')];
                }
            });
        });
    };
    Plugins.prototype.subtopicsForTopic = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, plugin, foundTopic;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!id) {
                            return [2 /*return*/];
                        }
                        _i = 0, _a = this.plugins;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        plugin = _a[_i];
                        return [4 /*yield*/, plugin.findTopic(id)];
                    case 2:
                        foundTopic = _b.sent();
                        if (foundTopic) {
                            return [2 /*return*/, plugin.topics.filter(function (t) {
                                    if (!t.id) {
                                        return false;
                                    }
                                    if (t.id === id) {
                                        return false;
                                    }
                                    var re = new RegExp("^" + id);
                                    return !!t.id.match(re);
                                })];
                        }
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Plugins.prototype.findTopic = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, plugin, t;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!id) {
                            return [2 /*return*/];
                        }
                        _i = 0, _a = this.plugins;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        plugin = _a[_i];
                        return [4 /*yield*/, plugin.findTopic(id)];
                    case 2:
                        t = _b.sent();
                        if (t) {
                            return [2 /*return*/, t];
                        }
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Plugins.prototype.clearCache = function () {
        var _a;
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        (_a = this.cache).deletePlugin.apply(_a, paths);
    };
    Object.defineProperty(Plugins.prototype, "topics", {
        get: function () {
            return uniqby(this.plugins.reduce(function (t, p) { return t.concat(p.topics); }, []), 'id');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Plugins.prototype, "groups", {
        get: function () {
            return this.plugins
                .filter(function (p) { return p.groups; })
                .reduce(function (t, p) { return t.concat(p.groups); }, []);
        },
        enumerable: true,
        configurable: true
    });
    return Plugins;
}());
exports.default = Plugins;
//# sourceMappingURL=Plugins.js.map