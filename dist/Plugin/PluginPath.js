"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var PluginPath = /** @class */ (function () {
    function PluginPath(options) {
        this.out = options.output;
        this.path = options.path;
        this.type = options.type;
        this.tag = options.tag;
        this.config = this.out.config;
        // process.env.CACHE_REQUIRE_PATHS_FILE = this.config.requireCachePath
        // require('cache-require-paths')
    }
    PluginPath.prototype.convertToCached = function () {
        return __awaiter(this, void 0, void 0, function () {
            var plugin, getAliases, commands, topics, _loop_1, _i, commands_1, command, groups, _a, name, version;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.require()];
                    case 1:
                        plugin = _b.sent();
                        getAliases = function (c) {
                            var aliases = c.aliases || [];
                            if (c.default) {
                                _this.out.warn("default setting on " + c.topic + " is deprecated");
                                aliases.push(c.topic);
                            }
                            return aliases;
                        };
                        if (!plugin.commands) {
                            throw new Error('no commands found');
                        }
                        commands = plugin.commands.map(function (c) { return ({
                            id: c.id || _this.makeID(c),
                            topic: c.topic,
                            command: c.command,
                            description: c.description,
                            args: c.args,
                            variableArgs: c.variableArgs,
                            help: c.help,
                            usage: c.usage,
                            hidden: !!c.hidden,
                            aliases: getAliases(c),
                            flags: c.flags,
                            group: c.group,
                        }); });
                        topics = (plugin.topics || []).map(function (t) { return ({
                            id: t.id || '',
                            topic: t.topic || '',
                            description: t.description,
                            hidden: !!t.hidden,
                            group: t.group,
                        }); });
                        _loop_1 = function (command) {
                            if (topics.find(function (t) { return t.id === command.topic; })) {
                                return "continue";
                            }
                            var topic = {
                                id: command.topic,
                                topic: command.topic,
                                group: command.group,
                                hidden: true,
                            };
                            topics.push(topic);
                        };
                        for (_i = 0, commands_1 = commands; _i < commands_1.length; _i++) {
                            command = commands_1[_i];
                            _loop_1(command);
                        }
                        groups = plugin.groups || [];
                        _a = this.pjson(), name = _a.name, version = _a.version;
                        return [2 /*return*/, { name: name, path: this.path, version: version, commands: commands, topics: topics, groups: groups }];
                }
            });
        });
    };
    // TODO rm any hack
    PluginPath.prototype.undefaultTopic = function (t) {
        if (t.default) {
            t = t.default;
        }
        // normalize v5 exported topic
        if (!t.topic) {
            t.topic = t.name || '';
        }
        if (!t.id) {
            t.id = t.topic;
        }
        return t;
    };
    PluginPath.prototype.undefaultCommand = function (c) {
        if (c.default && typeof c.default !== 'boolean') {
            return c.default;
        }
        return c;
    };
    PluginPath.prototype.require = function () {
        return __awaiter(this, void 0, void 0, function () {
            var required, err_1, exportedTopic, exportedTopics, topics, commands, groups;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 1, , 3]);
                        required = require(this.path);
                        return [3 /*break*/, 3];
                    case 1:
                        err_1 = _a.sent();
                        return [4 /*yield*/, this.repair(err_1)];
                    case 2:
                        if (_a.sent()) {
                            return [2 /*return*/, this.require()];
                        }
                        else {
                            throw err_1;
                        }
                        return [3 /*break*/, 3];
                    case 3:
                        exportedTopic = required.topic && this.undefaultTopic(required.topic);
                        exportedTopics = required.topics && required.topics.map(function (t) { return _this.undefaultTopic(t); });
                        topics = this.parsePjsonTopics()
                            .concat(exportedTopics || [])
                            .concat(exportedTopic || []);
                        commands = required.commands && required.commands.map(function (t) { return _this.undefaultCommand(t); });
                        groups = required.groups || [];
                        return [2 /*return*/, { topics: topics, commands: commands, groups: groups }];
                }
            });
        });
    };
    PluginPath.prototype.parsePjsonTopics = function () {
        // flow$ignore
        var topics = (this.pjson()['cli-engine'] || {}).topics;
        return this.transformPjsonTopics(topics);
    };
    PluginPath.prototype.transformPjsonTopics = function (topics, prefix) {
        var flatten = require('lodash.flatten');
        return flatten(this._transformPjsonTopics(topics));
    };
    PluginPath.prototype._transformPjsonTopics = function (topics, prefix) {
        var _this = this;
        if (!topics) {
            return [];
        }
        return Object.keys(topics || {}).map(function (k) {
            var t = topics[k];
            var id = prefix ? prefix + ":" + k : k;
            var topic = __assign({}, t, { id: id, topic: id });
            if (t.subtopics) {
                return [topic].concat(_this._transformPjsonTopics(t.subtopics, topic.id));
            }
            return topic;
        });
    };
    PluginPath.prototype.makeID = function (o) {
        return [o.topic || o.name, o.command].filter(function (s) { return s; }).join(':');
    };
    PluginPath.prototype.pjson = function () {
        if (this.type === 'builtin') {
            return { name: 'builtin', version: this.config.version };
        }
        return require(path.join(this.path, 'package.json'));
    };
    PluginPath.prototype.repair = function (err) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, false];
            });
        });
    };
    return PluginPath;
}());
exports.PluginPath = PluginPath;
//# sourceMappingURL=PluginPath.js.map