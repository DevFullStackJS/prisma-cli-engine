"use strict";
// // @flow
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
var Parser_1 = require("./Parser");
var index_1 = require("./Flags/index");
test('parses args and flags', function () { return __awaiter(_this, void 0, void 0, function () {
    var p, _a, argv, flags;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                p = new Parser_1.Parser({
                    args: [{ name: 'myarg' }, { name: 'myarg2' }],
                    flags: { myflag: index_1.flags.string() },
                });
                return [4 /*yield*/, p.parse({
                        argv: ['foo', '--myflag', 'bar', 'baz'],
                    })];
            case 1:
                _a = _b.sent(), argv = _a.argv, flags = _a.flags;
                expect(argv[0]).toEqual('foo');
                expect(argv[1]).toEqual('baz');
                expect(flags.myflag).toEqual('bar');
                return [2 /*return*/];
        }
    });
}); });
describe('flags', function () {
    test('parses flags', function () { return __awaiter(_this, void 0, void 0, function () {
        var p, flags;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    p = new Parser_1.Parser({
                        flags: { myflag: index_1.flags.boolean(), myflag2: index_1.flags.boolean() },
                    });
                    return [4 /*yield*/, p.parse({ argv: ['--myflag', '--myflag2'] })];
                case 1:
                    flags = (_a.sent()).flags;
                    expect(flags.myflag).toBeTruthy();
                    expect(flags.myflag2).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    test('parses short flags', function () { return __awaiter(_this, void 0, void 0, function () {
        var p, flags;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    p = new Parser_1.Parser({
                        flags: {
                            myflag: index_1.flags.boolean({ char: 'm' }),
                            force: index_1.flags.boolean({ char: 'f' }),
                        },
                    });
                    return [4 /*yield*/, p.parse({ argv: ['-mf'] })];
                case 1:
                    flags = (_a.sent()).flags;
                    expect(flags.myflag).toBeTruthy();
                    expect(flags.force).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    test('parses flag value with "=" to separate', function () { return __awaiter(_this, void 0, void 0, function () {
        var p, flags;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    p = new Parser_1.Parser({
                        flags: {
                            myflag: index_1.flags.string({ char: 'm' }),
                        },
                    });
                    return [4 /*yield*/, p.parse({ argv: ['--myflag=foo'] })];
                case 1:
                    flags = (_a.sent()).flags;
                    expect(flags).toEqual({ myflag: 'foo' });
                    return [2 /*return*/];
            }
        });
    }); });
    test('parses flag value with "=" in value', function () { return __awaiter(_this, void 0, void 0, function () {
        var p, flags;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    p = new Parser_1.Parser({
                        flags: {
                            myflag: index_1.flags.string({ char: 'm' }),
                        },
                    });
                    return [4 /*yield*/, p.parse({ argv: ['--myflag', '=foo'] })];
                case 1:
                    flags = (_a.sent()).flags;
                    expect(flags).toEqual({ myflag: '=foo' });
                    return [2 /*return*/];
            }
        });
    }); });
    test('parses short flag value with "="', function () { return __awaiter(_this, void 0, void 0, function () {
        var p, flags;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    p = new Parser_1.Parser({
                        flags: {
                            myflag: index_1.flags.string({ char: 'm' }),
                        },
                    });
                    return [4 /*yield*/, p.parse({ argv: ['-m=foo'] })];
                case 1:
                    flags = (_a.sent()).flags;
                    expect(flags).toEqual({ myflag: 'foo' });
                    return [2 /*return*/];
            }
        });
    }); });
    test('requires required flag', function () { return __awaiter(_this, void 0, void 0, function () {
        var p, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    p = new Parser_1.Parser({
                        flags: {
                            myflag: index_1.flags.string({ required: true }),
                        },
                    });
                    expect.assertions(1);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, p.parse()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    expect(err_1.message).toEqual('Missing required flag --myflag');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    test('requires nonoptional flag', function () { return __awaiter(_this, void 0, void 0, function () {
        var p, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    p = new Parser_1.Parser({
                        flags: {
                            myflag: index_1.flags.string({ required: true }),
                        },
                    });
                    expect.assertions(1);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, p.parse()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    expect(err_2.message).toEqual('Missing required flag --myflag');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    test('removes flags from argv', function () { return __awaiter(_this, void 0, void 0, function () {
        var p, _a, flags, argv;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    p = new Parser_1.Parser({
                        args: [{ name: 'myarg' }],
                        flags: { myflag: index_1.flags.string() },
                    });
                    return [4 /*yield*/, p.parse({ argv: ['--myflag', 'bar', 'foo'] })];
                case 1:
                    _a = _b.sent(), flags = _a.flags, argv = _a.argv;
                    expect(flags).toEqual({ myflag: 'bar' });
                    expect(argv).toEqual(['foo']);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('args', function () {
    test('requires no args by default', function () { return __awaiter(_this, void 0, void 0, function () {
        var p, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expect.assertions(0);
                    p = new Parser_1.Parser({ args: [{ name: 'myarg' }, { name: 'myarg2' }] });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, p.parse()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    expect(err_3.message).toEqual('Missing required argument myarg');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    test('parses args', function () { return __awaiter(_this, void 0, void 0, function () {
        var p, argv;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    p = new Parser_1.Parser({ args: [{ name: 'myarg' }, { name: 'myarg2' }] });
                    return [4 /*yield*/, p.parse({ argv: ['foo', 'bar'] })];
                case 1:
                    argv = (_a.sent()).argv;
                    expect(argv).toEqual(['foo', 'bar']);
                    return [2 /*return*/];
            }
        });
    }); });
    test('skips optional args', function () { return __awaiter(_this, void 0, void 0, function () {
        var p, argv;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    p = new Parser_1.Parser({
                        args: [
                            { name: 'myarg', required: false },
                            { name: 'myarg2', required: false },
                        ],
                    });
                    return [4 /*yield*/, p.parse({ argv: ['foo'] })];
                case 1:
                    argv = (_a.sent()).argv;
                    expect(argv).toEqual(['foo']);
                    return [2 /*return*/];
            }
        });
    }); });
    test('parses something looking like a flag as an arg', function () { return __awaiter(_this, void 0, void 0, function () {
        var p, argv;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    p = new Parser_1.Parser({ args: [{ name: 'myarg' }] });
                    return [4 /*yield*/, p.parse({ argv: ['--foo'] })];
                case 1:
                    argv = (_a.sent()).argv;
                    expect(argv).toEqual(['--foo']);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('variableArgs', function () {
    test('skips flag parsing after "--"', function () { return __awaiter(_this, void 0, void 0, function () {
        var p, _a, argv, args;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    p = new Parser_1.Parser({
                        variableArgs: true,
                        flags: { myflag: index_1.flags.boolean() },
                        args: [{ name: 'argOne' }],
                    });
                    return [4 /*yield*/, p.parse({
                            argv: ['foo', 'bar', '--', '--myflag'],
                        })];
                case 1:
                    _a = _b.sent(), argv = _a.argv, args = _a.args;
                    expect(argv).toEqual(['foo', 'bar', '--myflag']);
                    expect(args).toEqual({ argOne: 'foo' });
                    return [2 /*return*/];
            }
        });
    }); });
    test('does not repeat arguments', function () { return __awaiter(_this, void 0, void 0, function () {
        var p, argv;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    p = new Parser_1.Parser({
                        variableArgs: true,
                    });
                    return [4 /*yield*/, p.parse({ argv: ['foo', '--myflag=foo bar'] })];
                case 1:
                    argv = (_a.sent()).argv;
                    expect(argv).toEqual(['foo', '--myflag=foo bar']);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=Parser.test.js.map