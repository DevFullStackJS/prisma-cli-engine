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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable */
require("source-map-support/register");
var Command_1 = require("./Command");
var Flags_1 = require("./Flags");
var Config_1 = require("./Config");
var Command = /** @class */ (function (_super) {
    __extends(Command, _super);
    function Command() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Command.topic = 'foo';
    Command.command = 'bar';
    Command.flags = { myflag: Flags_1.flags.boolean() };
    Command.args = [{ name: 'myarg', required: false }];
    return Command;
}(Command_1.Command));
test('gets the version tokens correctly', function () { return __awaiter(_this, void 0, void 0, function () {
    var cmd;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Command.mock()];
            case 1:
                cmd = _a.sent();
                expect(cmd.getVersionTokens('1.30.0')).toEqual({
                    minorVersion: '1.30',
                    stage: 'master'
                });
                expect(cmd.getVersionTokens('1.31.0-beta')).toEqual({
                    minorVersion: '1.31',
                    stage: 'beta'
                });
                expect(cmd.getVersionTokens('1.31.0-beta.5')).toEqual({
                    minorVersion: '1.31',
                    stage: 'beta'
                });
                expect(cmd.getVersionTokens('1.31.2-alpha')).toEqual({
                    minorVersion: '1.31',
                    stage: 'alpha'
                });
                expect(cmd.getVersionTokens('1.31.0-alpha.5')).toEqual({
                    minorVersion: '1.31',
                    stage: 'alpha'
                });
                expect(cmd.getVersionTokens('1.31-alpha.5')).toEqual({
                    minorVersion: '1.31',
                    stage: 'alpha'
                });
                expect(cmd.getVersionTokens('1.31.2-alpha.5')).toEqual({
                    minorVersion: '1.31',
                    stage: 'alpha'
                });
                expect(cmd.getVersionTokens('1.31-alpha-7')).toEqual({
                    minorVersion: '1.31',
                    stage: 'alpha'
                });
                return [2 /*return*/];
        }
    });
}); });
test('compares the versions correctly', function () { return __awaiter(_this, void 0, void 0, function () {
    var cmd;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Command.mock()];
            case 1:
                cmd = _a.sent();
                expect(cmd.compareVersions('1.30.0', '1.29.0')).toBe(false);
                expect(cmd.compareVersions('1.30.2', '1.30.2')).toBe(true);
                expect(cmd.compareVersions('1.30.0', '1.30.2')).toBe(true);
                expect(cmd.compareVersions('1.30.2-alpha', '1.30.0')).toBe(false);
                expect(cmd.compareVersions('1.30.2-alpha', '1.30.0-beta')).toBe(false);
                expect(cmd.compareVersions('1.30.2-alpha', '1.30.5-alpha')).toBe(true);
                expect(cmd.compareVersions('1.30.2-alpha', '1.31.0-alpha')).toBe(false);
                expect(cmd.compareVersions('1.30.2-alpha.5', '1.31.0-alpha.7')).toBe(false);
                expect(cmd.compareVersions('1.31.2-alpha.5', '1.31-alpha.7')).toBe(true);
                expect(cmd.compareVersions('1.31.2-alpha.5', '1.31-alpha-7')).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
test('shows the ID', function () {
    expect(Command.id).toEqual('foo:bar');
});
test('runs the command', function () { return __awaiter(_this, void 0, void 0, function () {
    var cmd;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Command.mock()];
            case 1:
                cmd = _a.sent();
                expect(cmd.flags).toEqual({});
                expect(cmd.argv).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
test('has stdout', function () { return __awaiter(_this, void 0, void 0, function () {
    var Command, stdout;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                Command = /** @class */ (function (_super) {
                    __extends(Command, _super);
                    function Command() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    Command.prototype.run = function () {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                this.out.stdout.log(this.flags.print);
                                return [2 /*return*/];
                            });
                        });
                    };
                    Command.flags = {
                        print: Flags_1.flags.string(),
                        bool: Flags_1.flags.boolean(),
                    };
                    return Command;
                }(Command_1.Command));
                return [4 /*yield*/, Command.mock('--print=foo')];
            case 1:
                stdout = (_a.sent()).stdout;
                expect(stdout).toEqual('foo\n');
                return [2 /*return*/];
        }
    });
}); });
test('has stderr', function () { return __awaiter(_this, void 0, void 0, function () {
    var Command, stderr;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                Command = /** @class */ (function (_super) {
                    __extends(Command, _super);
                    function Command() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    Command.prototype.run = function () {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                this.out.stderr.log(this.flags.print);
                                return [2 /*return*/];
                            });
                        });
                    };
                    Command.flags = { print: Flags_1.flags.string() };
                    return Command;
                }(Command_1.Command));
                return [4 /*yield*/, Command.mock('--print=foo')];
            case 1:
                stderr = (_a.sent()).stderr;
                expect(stderr).toEqual('foo\n');
                return [2 /*return*/];
        }
    });
}); });
test('parses args', function () { return __awaiter(_this, void 0, void 0, function () {
    var cmd;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Command.mock('one')];
            case 1:
                cmd = _a.sent();
                expect(cmd.flags).toEqual({});
                expect(cmd.argv).toEqual(['one']);
                expect(cmd.args).toEqual({ myarg: 'one' });
                return [2 /*return*/];
        }
    });
}); });
test('has help', function () { return __awaiter(_this, void 0, void 0, function () {
    var Command, config;
    return __generator(this, function (_a) {
        Command = /** @class */ (function (_super) {
            __extends(Command, _super);
            function Command() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Command.topic = 'config';
            Command.command = 'get';
            Command.help = "this is\n\nsome multiline help\n";
            return Command;
        }(Command_1.Command));
        config = new Config_1.Config({ mock: true });
        expect(Command.buildHelp(config)).toMatchSnapshot('buildHelp');
        expect(Command.buildHelpLine(config)).toMatchSnapshot('buildHelpLine');
        return [2 /*return*/];
    });
}); });
//# sourceMappingURL=Command.test.js.map