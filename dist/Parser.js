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
var RequiredFlagError_1 = require("./errors/RequiredFlagError");
var chalk_1 = require("chalk");
var Parser = /** @class */ (function () {
    function Parser(input) {
        this.input = input;
        input.args = input.args || [];
        input.flags = input.flags || {};
    }
    Parser.prototype.parse = function (output) {
        if (output === void 0) { output = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var argv, parseFlag, findLongFlag, findShortFlag, parsingFlags, maxArgs, minArgs, arg, argDefinition, _i, _a, name_1, flag, _b, _c;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        argv = output.argv || [];
                        output.flags = output.flags || {};
                        output.argv = [];
                        output.args = {};
                        parseFlag = function (arg) {
                            var long = arg.startsWith('--');
                            var name = long ? findLongFlag(arg) : findShortFlag(arg);
                            if (!name) {
                                var i = arg.indexOf('=');
                                if (i !== -1) {
                                    var sliced = arg.slice(i + 1);
                                    argv.unshift(sliced);
                                    var equalsParsed = parseFlag(arg.slice(0, i));
                                    if (!equalsParsed) {
                                        argv.shift();
                                    }
                                    return equalsParsed;
                                }
                                else if (_this.input.cmd &&
                                    !_this.input.cmd.constructor.allowAnyFlags) {
                                    if (_this.input.cmd.constructor.name === 'Export' && arg === '-E') {
                                        throw new Error("-E has been renamed to -e. -e has been renamed to -p. Get more information with " + chalk_1.default.bold.green('prisma export -h'));
                                    }
                                    else {
                                        throw new Error("Unknown flag " + arg);
                                    }
                                }
                                return false;
                            }
                            var flag = _this.input.flags[name];
                            var cur = output.flags[name];
                            if (flag.parse) {
                                // TODO: handle multiple flags
                                if (cur) {
                                    throw new Error("Flag --" + name + " already provided");
                                }
                                var input = long || arg.length < 3
                                    ? argv.shift()
                                    : arg.slice(arg[2] === '=' ? 3 : 2);
                                if (!input) {
                                    throw new Error("Flag --" + name + " expects a value");
                                }
                                output.flags[name] = input;
                            }
                            else {
                                if (!cur) {
                                    output.flags[name] = true;
                                }
                                // push the rest of the short characters back on the stack
                                if (!long && arg.length > 2) {
                                    argv.unshift("-" + arg.slice(2));
                                }
                            }
                            return true;
                        };
                        findLongFlag = function (arg) {
                            var name = arg.slice(2);
                            if (_this.input.flags[name]) {
                                return name;
                            }
                            return null;
                        };
                        findShortFlag = function (arg) {
                            for (var _i = 0, _a = Object.keys(_this.input.flags); _i < _a.length; _i++) {
                                var k = _a[_i];
                                if (_this.input.flags[k].char === arg[1]) {
                                    return k;
                                }
                            }
                            return null;
                        };
                        parsingFlags = true;
                        maxArgs = this.input.args.length;
                        minArgs = this.input.args.filter(function (a) { return a.required; }).length;
                        while (argv.length) {
                            arg = argv.shift();
                            if (parsingFlags && arg.startsWith('-')) {
                                // attempt to parse as flag
                                if (arg === '--') {
                                    parsingFlags = false;
                                    continue;
                                }
                                if (parseFlag(arg)) {
                                    continue;
                                }
                                // not actually a flag if it reaches here so parse as an arg
                            }
                            argDefinition = this.input.args[output.argv.length];
                            if (argDefinition) {
                                output.args[argDefinition.name] = arg;
                            }
                            output.argv.push(arg);
                        }
                        // TODO find better solution
                        if (!this.input.variableArgs && output.argv.length > maxArgs + 2) {
                            throw new Error("Unexpected argument " + output.argv[maxArgs]);
                        }
                        if (output.argv.length < minArgs) {
                            throw new Error("Missing required argument " + this.input.args[output.argv.length].name);
                        }
                        _i = 0, _a = Object.keys(this.input.flags);
                        _d.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        name_1 = _a[_i];
                        flag = this.input.flags[name_1];
                        if (!flag.parse) return [3 /*break*/, 3];
                        _b = output.flags;
                        _c = name_1;
                        return [4 /*yield*/, flag.parse(['string', 'number', 'boolean'].includes(typeof output.flags[name_1])
                                ? String(output.flags[name_1])
                                : undefined, this.input.cmd, name_1)];
                    case 2:
                        _b[_c] = _d.sent();
                        if (flag.required && !output.flags[name_1]) {
                            throw new RequiredFlagError_1.RequiredFlagError(name_1);
                        }
                        _d.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, output];
                }
            });
        });
    };
    return Parser;
}());
exports.Parser = Parser;
//# sourceMappingURL=Parser.js.map