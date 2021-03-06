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
var StreamOutput_1 = require("./StreamOutput");
var chalk_1 = require("chalk");
var styles = require("ansi-styles");
var ActionBase_1 = require("./actions/ActionBase");
var Prompter_1 = require("./Prompter");
var supports = require("supports-color");
var SpinnerAction_1 = require("./actions/SpinnerAction");
var SimpleAction_1 = require("./actions/SimpleAction");
var path = require("path");
var util = require("util");
var screen_1 = require("./actions/screen");
var ExitError_1 = require("../errors/ExitError");
var inquirer = require("inquirer");
var migration_1 = require("./migration");
var treeify = require("treeify");
var dirTree = require("directory-tree");
var marked = require("marked");
var TerminalRenderer = require("marked-terminal");
var Charm = require("charm");
var lodash_1 = require("lodash");
var Raven = require("raven");
var StatusChecker_1 = require("../StatusChecker");
var debug = require('debug')('output');
marked.setOptions({
    renderer: new TerminalRenderer(),
});
exports.CustomColors = {
    // map gray -> dim because it's not solarized compatible
    supports: supports,
    gray: function (s) { return chalk_1.default.dim(s); },
    grey: function (s) { return chalk_1.default.dim(s); },
    attachment: function (s) { return chalk_1.default.cyan(s); },
    addon: function (s) { return chalk_1.default.yellow(s); },
    configVar: function (s) { return chalk_1.default.green(s); },
    release: function (s) { return chalk_1.default.blue.bold(s); },
    cmd: function (s) { return chalk_1.default.green.bold(s); },
    app: function (s) { return exports.CustomColors.prisma("\u2B22 " + s); },
    prisma: function (s) {
        if (!exports.CustomColors.supports) {
            return s;
        }
        var has256 = exports.CustomColors.supports.has256 ||
            (process.env.TERM || '').indexOf('256') !== -1;
        return has256
            ? '\u001b[38;5;104m' + s + styles.reset.open
            : chalk_1.default.magenta(s);
    },
};
function wrap(msg) {
    var linewrap = require('@heroku/linewrap');
    return linewrap(6, screen_1.errtermwidth, {
        skipScheme: 'ansi-color',
        skip: /^\$ .*$/,
    })(msg);
}
function bangify(msg, c) {
    var lines = msg.split('\n');
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        lines[i] = ' ' + c + line.substr(2, line.length);
    }
    return lines.join('\n');
}
function extractMessage(response) {
    try {
        return response.errors[0].message;
    }
    catch (e) {
        return "GraphQL Error (Code: " + response.status + ")";
    }
}
var arrow = process.platform === 'win32' ? '!' : '▸';
var Output = /** @class */ (function () {
    function Output(config) {
        this.mock = false;
        this.config = config;
        if (config && config.mock) {
            this.mock = config.mock;
        }
        this.stdout = new StreamOutput_1.default(process.stdout, this);
        this.stderr = new StreamOutput_1.default(process.stderr, this);
        this.action = ActionBase_1.shouldDisplaySpinner(this)
            ? new SpinnerAction_1.SpinnerAction(this)
            : new SimpleAction_1.SimpleAction(this);
        if (this.mock) {
            chalk_1.default.enabled = false;
            exports.CustomColors.supports = false;
        }
        this.prompter = new Prompter_1.default(this);
        this.prompt =
            (this.config &&
                this.config.mockInquirer &&
                this.config.mockInquirer.prompt) ||
                inquirer.createPromptModule({
                    output: process.stdout,
                });
        this.migration = new migration_1.MigrationPrinter(this);
        this.charm = Charm();
        this.charm.pipe(process.stdout);
    }
    Object.defineProperty(Output.prototype, "color", {
        get: function () {
            return new Proxy(chalk_1.default, {
                get: function (chalkProxy, name) {
                    if (exports.CustomColors[name]) {
                        return exports.CustomColors[name];
                    }
                    return chalkProxy[name];
                },
            });
        },
        enumerable: true,
        configurable: true
    });
    Output.prototype.log = function (data) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (_a = this.stdout).log.apply(_a, [data].concat(args));
    };
    Output.prototype.getStyledJSON = function (obj, subtle) {
        if (subtle === void 0) { subtle = false; }
        var json = JSON.stringify(obj, null, 2);
        if (chalk_1.default.enabled) {
            var cardinal = require('cardinal');
            var theme = require(subtle ? './subtle' : 'cardinal/themes/jq');
            return cardinal.highlight(json, { json: true, theme: theme });
        }
        else {
            return json;
        }
    };
    Output.prototype.done = function () {
        var rest = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rest[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.action.stop();
                return [2 /*return*/];
            });
        });
    };
    Output.prototype.debug = function (obj) {
        if (this.config.debug) {
            this.action.pause(function () { return console.log(obj); });
        }
    };
    Object.defineProperty(Output.prototype, "errlog", {
        get: function () {
            return path.join(this.config.cacheDir, 'error.log');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "autoupdatelog", {
        get: function () {
            return path.join(this.config.cacheDir, 'autoupdate.log');
        },
        enumerable: true,
        configurable: true
    });
    Output.prototype.error = function (err, exitCode) {
        if (exitCode === void 0) { exitCode = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var instruction, statusChecker;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (process.env.NODE_ENV === 'test') {
                            console.error(err);
                            throw err;
                        }
                        try {
                            if (typeof err === 'string') {
                                err = new Error(err);
                            }
                            this.logError(err);
                            if (this.action.task) {
                                this.action.stop(this.color.bold.red('!'));
                            }
                            if (this.config.debug) {
                                this.stderr.log(err.stack || util.inspect(err));
                            }
                            else {
                                this.stderr.log(this.isGraphQLError(err)
                                    ? this.getGraphQLErrorMessage(err)
                                    : bangify(wrap(this.getErrorMessage(err)), this.color.red(arrow)));
                                instruction = process.env.SHELL && process.env.SHELL.endsWith('fish')
                                    ? '$ set -x DEBUG "*"'
                                    : '$ export DEBUG="*"';
                                this.stderr.log("\nGet in touch if you need help: https://slack.prisma.io\nTo get more detailed output, run " + chalk_1.default.dim(instruction));
                            }
                        }
                        catch (e) {
                            console.error('error displaying error');
                            console.error(e);
                            console.error(err);
                        }
                        statusChecker = StatusChecker_1.getStatusChecker();
                        if (statusChecker) {
                            statusChecker.checkStatus(process.argv[2], {}, {}, process.argv.slice(2), err);
                        }
                        return [4 /*yield*/, new Promise(function (r) {
                                Raven.captureException(err, function () { return r(); });
                            })];
                    case 1:
                        _a.sent();
                        if (exitCode !== false) {
                            this.exit(exitCode);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Output.prototype.isGraphQLError = function (err) {
        return err.message && err.request && err.response;
    };
    Output.prototype.warn = function (err, prefix) {
        var _this = this;
        this.action.pause(function () {
            try {
                prefix = prefix ? prefix + " " : '';
                err = typeof err === 'string' ? new Error(err) : err;
                _this.logError(err);
                if (_this.config.debug) {
                    if (process.stderr.write("WARNING: " + prefix)) {
                        _this.stderr.log(err.stack || util.inspect(err));
                    }
                }
                else {
                    _this.stderr.log(bangify(wrap(prefix + _this.getErrorMessage(err)), _this.color.yellow(arrow)) + '\n');
                }
            }
            catch (e) {
                console.error('error displaying warning');
                console.error(e);
                console.error(err);
            }
        }, this.color.bold.yellow('!'));
    };
    Output.prototype.getErrorPrefix = function (fileName, type) {
        if (type === void 0) { type = 'error'; }
        var method = type === 'error' ? 'red' : 'yellow';
        return chalk_1.default[method]("[" + type.toUpperCase() + "] in " + chalk_1.default.bold(fileName) + ": ");
    };
    Output.prototype.logError = function (err) {
        StreamOutput_1.logToFile(util.inspect(err) + '\n', this.errlog);
    };
    Output.prototype.printMarkdown = function (markdown) {
        this.log(marked(markdown));
    };
    Output.prototype.oldprompt = function (name, options) {
        return this.prompter.prompt(name, options);
    };
    Output.prototype.table = function (data, options) {
        var table = require('./table');
        return table(this, data, options);
    };
    Output.prototype.exit = function (code) {
        if (code === void 0) { code = 0; }
        debug("Exiting with code: " + code);
        if (this.mock && process.env.NODE_ENV === 'test') {
            throw new ExitError_1.default(code);
        }
        else {
            process.exit(code);
        }
    };
    Output.prototype.filesTree = function (files) {
        var tree = filesToTree(files);
        var printedTree = treeify.asTree(tree, true);
        this.log(chalk_1.default.dim(printedTree.split('\n').join('\n')));
    };
    Output.prototype.tree = function (dirPath, padding) {
        if (padding === void 0) { padding = false; }
        var tree = dirTree(dirPath);
        var convertedTree = treeConverter(tree);
        var printedTree = treeify.asTree(convertedTree, true);
        this.log(chalk_1.default.blue(printedTree
            .split('\n')
            .map(function (l) { return (padding ? '  ' : '') + l; })
            .join('\n')));
    };
    Output.prototype.up = function (y) {
        if (y === void 0) { y = 1; }
        for (var i = 0; i < y; i++) {
            this.charm.delete('line', 1);
            this.charm.up(1);
        }
    };
    Output.prototype.printPadded = function (arr1, spaceLeft, spaceBetween, header) {
        if (spaceLeft === void 0) { spaceLeft = 0; }
        if (spaceBetween === void 0) { spaceBetween = 1; }
        var inputRows = arr1;
        if (header) {
            inputRows.unshift(header);
        }
        var leftCol = inputRows.map(function (a) { return a[0]; });
        var rightCol = inputRows.map(function (a) { return a[1]; });
        var maxLeftCol = leftCol.reduce(function (acc, curr) { return Math.max(acc, curr.length); }, -1);
        var maxRightCol = rightCol.reduce(function (acc, curr) { return Math.max(acc, curr.length); }, -1);
        var paddedLeftCol = leftCol.map(function (v) { return lodash_1.repeat(' ', spaceLeft) + lodash_1.padEnd(v, maxLeftCol + spaceBetween); });
        var rows = paddedLeftCol.map(function (l, i) { return l + arr1[i][1]; });
        if (header) {
            var divider = "" + lodash_1.repeat('─', maxLeftCol) + lodash_1.repeat(' ', spaceBetween) + lodash_1.repeat('─', maxRightCol);
            rows.splice(1, 0, divider);
        }
        return rows.join('\n');
    };
    Output.prototype.getGraphQLErrorMessage = function (err) {
        if (this.mock) {
            return ("\n" + chalk_1.default.bold.red('ERROR: ' + extractMessage(err.response)) + "\n\n" +
                chalk_1.default.bold('Request') +
                this.getStyledJSON(err.request, true) +
                chalk_1.default.bold('Response') +
                this.getStyledJSON(err.response, true));
        }
        else {
            return ("\n" + chalk_1.default.bold.red('ERROR: ' + extractMessage(err.response)) + "\n\n" +
                this.getStyledJSON(err.response, true));
        }
    };
    Output.prototype.getErrorMessage = function (err) {
        var message;
        if (err.body) {
            // API error
            if (err.body.message) {
                message = util.inspect(err.body.message);
            }
            else if (err.body.error) {
                message = util.inspect(err.body.error);
            }
        }
        // Unhandled error
        if (err.message && err.code) {
            message = chalk_1.default.bold(util.inspect(err.code)) + ": " + err.message;
        }
        else if (err.message) {
            message = err.message;
        }
        return message || util.inspect(err);
    };
    return Output;
}());
exports.Output = Output;
function treeConverter(tree) {
    if (!tree.children) {
        return tree.name;
    }
    return tree.children.reduce(function (acc, curr) {
        var _a, _b;
        if (!curr.children) {
            return __assign({}, acc, (_a = {}, _a[curr.name] = null, _a));
        }
        return __assign({}, acc, (_b = {}, _b[curr.name] = treeConverter(curr), _b));
    }, {});
}
function filesToTree(files) {
    var fileNames = files.map(function (l) {
        if (l.startsWith('./')) {
            return l.slice(2);
        }
        return l;
    });
    var obj = {};
    fileNames.forEach(function (fileName) {
        var setPath = fileName.split('/');
        lodash_1.set(obj, setPath, null);
    });
    return obj;
}
//# sourceMappingURL=index.js.map