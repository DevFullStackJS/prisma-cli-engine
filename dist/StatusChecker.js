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
var crypto = require("crypto");
var path = require("path");
var child_process_1 = require("child_process");
var fetch = require("isomorphic-fetch");
var fs = require("fs-extra");
var prisma_yml_1 = require("prisma-yml");
var os = require("os");
var isGlobal_1 = require("./utils/isGlobal");
var serializeError = require("serialize-error");
var StatusChecker = /** @class */ (function () {
    function StatusChecker(config, env) {
        this.config = config;
        this.env = env;
    }
    StatusChecker.prototype.checkStatus = function (command, args, flags, argv, error) {
        var source = 'CLI';
        var sourceVersion = this.config.version;
        var eventName = error ? 'command_error' : 'command_triggered';
        var serializedError = error ? convertError(error) : undefined;
        var payload = JSON.stringify({
            command: command,
            args: args,
            flags: flags,
            argv: argv,
            error: serializedError,
        });
        var auth = this.env ? this.env.cloudSessionKey : undefined;
        var hashDate = new Date().toISOString();
        var mac = getMac();
        var fid = getFid();
        var globalBin = isGlobal_1.getIsGlobal();
        var message = JSON.stringify({
            source: source,
            sourceVersion: sourceVersion,
            eventName: eventName,
            payload: payload,
            auth: auth,
            fid: fid,
            globalBin: globalBin,
            hashDate: hashDate,
        });
        var secret = 'loTheeChaxaiPhahsa8Aifiel';
        var hash = crypto
            .createHmac('sha256', secret)
            .update(message)
            .digest('hex');
        var query = "mutation(\n      $input: StatsInput!\n    ) {\n      sendStats(\n        data: $input\n      )\n    }";
        var options = {
            request: {
                query: query,
                variables: {
                    input: {
                        source: source,
                        sourceVersion: sourceVersion,
                        eventName: eventName,
                        payload: payload,
                        auth: auth,
                        fid: fid,
                        globalBin: globalBin,
                        hash: hash,
                        hashDate: hashDate,
                    },
                },
            },
            cachePath: this.config.requestsCachePath,
        };
        // Spawn a detached process, passing the options as an environment property
        // doJobs(options.cachePath, options.request)
        child_process_1.spawn(process.execPath, [path.join(__dirname, 'check.js'), JSON.stringify(options)], {
            detached: true,
            stdio: 'ignore',
        }).unref();
    };
    return StatusChecker;
}());
exports.StatusChecker = StatusChecker;
var statusChecker;
function initStatusChecker(config, env) {
    statusChecker = new StatusChecker(config, env);
    return statusChecker;
}
exports.initStatusChecker = initStatusChecker;
function getStatusChecker() {
    return statusChecker;
}
exports.getStatusChecker = getStatusChecker;
function doJobs(cachePath, request) {
    return __awaiter(this, void 0, void 0, function () {
        var requestsString, lines, pendingRequests, linesToDelete, _i, pendingRequests_1, job, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // use a '\n' separated list of stringified requests to make append only possible
                    fs.appendFileSync(cachePath, JSON.stringify(request) + '\n');
                    requestsString = fs.readFileSync(cachePath, 'utf-8');
                    lines = requestsString.split('\n');
                    pendingRequests = lines
                        .filter(function (r) { return r.trim() !== ''; })
                        .map(function (r) { return JSON.parse(r); });
                    linesToDelete = 0;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    _i = 0, pendingRequests_1 = pendingRequests;
                    _a.label = 2;
                case 2:
                    if (!(_i < pendingRequests_1.length)) return [3 /*break*/, 5];
                    job = pendingRequests_1[_i];
                    return [4 /*yield*/, requestWithTimeout(job)];
                case 3:
                    _a.sent();
                    linesToDelete++;
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 7];
                case 6:
                    e_1 = _a.sent();
                    return [3 /*break*/, 7];
                case 7:
                    fs.writeFileSync(cachePath, lines.slice(linesToDelete).join('\n'));
                    process.exit();
                    return [2 /*return*/];
            }
        });
    });
}
exports.doJobs = doJobs;
function requestWithTimeout(input) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var result, json;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                setTimeout(function () {
                                    reject('Timeout');
                                }, 5000);
                                return [4 /*yield*/, fetch(process.env.STATS_ENDPOINT || 'https://stats.prismagraphql.com', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(input),
                                        agent: prisma_yml_1.getProxyAgent('https://stats.prismagraphql.com'),
                                    })];
                            case 1:
                                result = _a.sent();
                                return [4 /*yield*/, result.json()];
                            case 2:
                                json = _a.sent();
                                resolve(json);
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
function getMac() {
    var interfaces = os.networkInterfaces();
    return Object.keys(interfaces).reduce(function (acc, key) {
        if (acc) {
            return acc;
        }
        var i = interfaces[key];
        var mac = i.find(function (a) { return a.mac !== '00:00:00:00:00:00'; });
        return mac ? mac.mac : null;
    }, null);
}
var fidCache = null;
function getFid() {
    if (fidCache) {
        return fidCache;
    }
    var mac = getMac();
    var fidSecret = 'AhTheeR7Pee0haebui1viemoe';
    var fid = mac
        ? crypto
            .createHmac('sha256', fidSecret)
            .update(mac)
            .digest('hex')
        : '';
    fidCache = fid;
    return fid;
}
exports.getFid = getFid;
function convertError(e) {
    if (typeof e === 'string') {
        return { message: e };
    }
    return serializeError(e);
}
//# sourceMappingURL=StatusChecker.js.map