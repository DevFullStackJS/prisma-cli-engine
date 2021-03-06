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
var path = require("path");
var fs = require("fs-extra");
var Lock_1 = require("./Lock");
var Plugin_1 = require("./Plugin");
var Cache = /** @class */ (function () {
    function Cache(output) {
        this.out = output;
        this.config = output.config;
    }
    Cache.prototype.initialize = function () {
        this._cache = {
            version: this.config.version,
            plugins: {},
            node_version: null,
        };
    };
    Cache.prototype.clear = function () {
        this._cache = {
            version: this.config.version,
            plugins: {},
            node_version: this._cache.node_version,
        };
        try {
            fs.removeSync(this.config.requireCachePath);
        }
        catch (e) {
            //
        }
    };
    Object.defineProperty(Cache.prototype, "file", {
        get: function () {
            return path.join(this.config.cacheDir, 'plugins.json');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cache.prototype, "cache", {
        get: function () {
            if (this._cache) {
                return this._cache;
            }
            try {
                this._cache = fs.readJSONSync(this.file);
            }
            catch (err) {
                if (err.code !== 'ENOENT') {
                    this.out.debug(err);
                }
                this.initialize();
            }
            if (this._cache.version !== this.config.version ||
                process.env.GRAPHCOOL_CLI_CLEAR_CACHE) {
                this.clear();
            }
            return this._cache;
        },
        enumerable: true,
        configurable: true
    });
    Cache.prototype.plugin = function (pluginPath) {
        return this.cache.plugins[pluginPath];
    };
    Cache.prototype.updatePlugin = function (pluginPath, plugin) {
        ;
        this.constructor.updated = true;
        this.cache.plugins[pluginPath] = plugin;
    };
    Cache.prototype.deletePlugin = function () {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        for (var _a = 0, paths_1 = paths; _a < paths_1.length; _a++) {
            var pluginPath = paths_1[_a];
            delete this.cache.plugins[pluginPath];
        }
        this.save();
    };
    Cache.prototype.fetch = function (pluginPath) {
        return __awaiter(this, void 0, void 0, function () {
            var c, cachedPlugin, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        c = this.plugin(pluginPath.path);
                        if (c) {
                            return [2 /*return*/, c];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 5]);
                        return [4 /*yield*/, pluginPath.convertToCached()];
                    case 2:
                        cachedPlugin = _a.sent();
                        this.updatePlugin(pluginPath.path, cachedPlugin);
                        return [2 /*return*/, cachedPlugin];
                    case 3:
                        err_1 = _a.sent();
                        if (pluginPath.type === 'builtin') {
                            throw err_1;
                        }
                        return [4 /*yield*/, pluginPath.repair(err_1)];
                    case 4:
                        if (_a.sent()) {
                            return [2 /*return*/, this.fetch(pluginPath)];
                        }
                        this.out.warn("Error parsing plugin " + pluginPath.path);
                        this.out.warn(err_1);
                        return [2 /*return*/, {
                                name: pluginPath.path,
                                path: pluginPath.path,
                                version: '',
                                commands: [],
                                topics: [],
                                groups: [],
                            }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Cache.prototype.fetchManagers = function () {
        var managers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            managers[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var plugins, lock, downgrade, _a, managers_1, manager, _b, managers_2, manager, paths, _loop_1, this_1, _c, paths_2, pluginPath;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        plugins = [];
                        if (!(this.cache.node_version !== process.version)) return [3 /*break*/, 7];
                        lock = new Lock_1.default(this.out);
                        return [4 /*yield*/, lock.upgrade()];
                    case 1:
                        downgrade = _d.sent();
                        _a = 0, managers_1 = managers;
                        _d.label = 2;
                    case 2:
                        if (!(_a < managers_1.length)) return [3 /*break*/, 5];
                        manager = managers_1[_a];
                        return [4 /*yield*/, manager.handleNodeVersionChange()];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4:
                        _a++;
                        return [3 /*break*/, 2];
                    case 5: return [4 /*yield*/, downgrade()];
                    case 6:
                        _d.sent();
                        this.cache.node_version = process.version;
                        this.constructor.updated = true;
                        _d.label = 7;
                    case 7:
                        _b = 0, managers_2 = managers;
                        _d.label = 8;
                    case 8:
                        if (!(_b < managers_2.length)) return [3 /*break*/, 14];
                        manager = managers_2[_b];
                        return [4 /*yield*/, manager.list()];
                    case 9:
                        paths = _d.sent();
                        _loop_1 = function (pluginPath) {
                            var plugin;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this_1.fetch(pluginPath)];
                                    case 1:
                                        plugin = _a.sent();
                                        if (plugins.find(function (p) { return p.name === plugin.name; })) {
                                            return [2 /*return*/, "continue"];
                                        }
                                        plugins.push(new Plugin_1.default(this_1.out, pluginPath, plugin));
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _c = 0, paths_2 = paths;
                        _d.label = 10;
                    case 10:
                        if (!(_c < paths_2.length)) return [3 /*break*/, 13];
                        pluginPath = paths_2[_c];
                        return [5 /*yield**/, _loop_1(pluginPath)];
                    case 11:
                        _d.sent();
                        _d.label = 12;
                    case 12:
                        _c++;
                        return [3 /*break*/, 10];
                    case 13:
                        _b++;
                        return [3 /*break*/, 8];
                    case 14:
                        this.save();
                        return [2 /*return*/, plugins];
                }
            });
        });
    };
    Cache.prototype.save = function () {
        if (!this.constructor.updated) {
            return;
        }
        try {
            fs.writeJSONSync(this.file, this.cache);
        }
        catch (err) {
            this.out.warn(err);
        }
    };
    Cache.updated = false;
    return Cache;
}());
exports.default = Cache;
//# sourceMappingURL=Cache.js.map