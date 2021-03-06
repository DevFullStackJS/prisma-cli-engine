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
var Plugins_1 = require("./Plugin/Plugins");
var util_1 = require("./util");
var NotFound = /** @class */ (function () {
    function NotFound(output, argv) {
        this.argv = argv;
        this.out = output;
        this.config = output.config;
        this.plugins = new Plugins_1.default(output);
    }
    NotFound.prototype.allCommands = function () {
        return this.plugins.commands.reduce(function (commands, c) {
            return commands.concat([c.id]).concat(c.aliases || []);
        }, []);
    };
    NotFound.prototype.closest = function (cmd) {
        var DCE = require('string-similarity');
        var commands = this.allCommands();
        if (commands.length > 0) {
            return DCE.findBestMatch(cmd, this.allCommands()).bestMatch.target;
        }
        return null;
    };
    NotFound.prototype.isValidTopic = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var t;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.plugins.findTopic(name)];
                    case 1:
                        t = _a.sent();
                        return [2 /*return*/, !!t];
                }
            });
        });
    };
    NotFound.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var closest, binHelp, id, idSplit, perhaps;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.plugins.load()];
                    case 1:
                        _a.sent();
                        binHelp = this.config.bin + " help";
                        id = util_1.getCommandId(this.argv.slice(1));
                        idSplit = id.split(':');
                        return [4 /*yield*/, this.isValidTopic(idSplit[0])];
                    case 2:
                        if (_a.sent()) {
                            // if valid topic, update binHelp with topic
                            binHelp = binHelp + " " + idSplit[0];
                            // if topic:COMMAND present, try closest for id
                            if (idSplit[1]) {
                                closest = this.closest(id);
                            }
                        }
                        else {
                            closest = this.closest(id);
                        }
                        perhaps = closest
                            ? "Perhaps you meant " + this.out.color.yellow(closest.split(':').join(' ')) + "\n"
                            : '';
                        this.out.error(this.out.color.yellow(idSplit.join(' ')) + " is not a " + this.config.bin + " command.\n" + perhaps + "Run " + this.out.color.cmd(binHelp) + " for a list of available commands.", 127);
                        return [2 /*return*/];
                }
            });
        });
    };
    return NotFound;
}());
exports.NotFound = NotFound;
//# sourceMappingURL=NotFound.js.map