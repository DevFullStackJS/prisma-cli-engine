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
var Topic_1 = require("../Topic");
var Plugin = /** @class */ (function () {
    function Plugin(out, pluginPath, cachedPlugin) {
        this.config = out.config;
        this.out = out;
        this.pluginPath = pluginPath;
        this.cachedPlugin = cachedPlugin;
    }
    Object.defineProperty(Plugin.prototype, "tag", {
        get: function () {
            return this.pluginPath.tag;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Plugin.prototype, "type", {
        get: function () {
            return this.pluginPath.type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Plugin.prototype, "path", {
        get: function () {
            return this.pluginPath.path;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Plugin.prototype, "name", {
        get: function () {
            return this.cachedPlugin.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Plugin.prototype, "version", {
        get: function () {
            return this.cachedPlugin.version;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Plugin.prototype, "commands", {
        get: function () {
            return this.cachedPlugin.commands;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Plugin.prototype, "groups", {
        get: function () {
            return this.cachedPlugin.groups;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Plugin.prototype, "topics", {
        get: function () {
            return this.cachedPlugin.topics;
        },
        enumerable: true,
        configurable: true
    });
    Plugin.prototype.findCommand = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var foundCommand, topic, command, p, Command;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!id) {
                            return [2 /*return*/];
                        }
                        foundCommand = this.commands.find(function (c) { return c.id === id || (c.aliases || []).includes(id); });
                        if (!foundCommand) {
                            return [2 /*return*/];
                        }
                        topic = foundCommand.topic, command = foundCommand.command;
                        return [4 /*yield*/, this.pluginPath.require()];
                    case 1:
                        p = _a.sent();
                        Command = (p.commands || []).find(function (d) { return topic === d.topic && command === d.command; });
                        return [2 /*return*/, Command];
                }
            });
        });
    };
    Plugin.prototype.findTopic = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var topic, plugin, foundTopic;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        topic = this.topics.find(function (t) { return t.id === id; });
                        if (!topic) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.pluginPath.require()];
                    case 1:
                        plugin = _a.sent();
                        foundTopic = (plugin.topics || []).find(function (t) { return [t.id].includes(id); });
                        if (!foundTopic) {
                            return [2 /*return*/];
                        }
                        return [2 /*return*/, typeof foundTopic === 'function'
                                ? foundTopic
                                : this.buildTopic(topic)];
                }
            });
        });
    };
    Plugin.prototype.buildTopic = function (t) {
        var _a;
        /* tslint:disable */
        return _a = /** @class */ (function (_super) {
                __extends(class_1, _super);
                function class_1() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return class_1;
            }(Topic_1.Topic)),
            _a.topic = t.id,
            _a.description = t.description,
            _a.hidden = t.hidden,
            _a.group = t.group,
            _a;
    };
    return Plugin;
}());
exports.default = Plugin;
//# sourceMappingURL=Plugin.js.map