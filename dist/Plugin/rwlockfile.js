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
/* tslint:disable */
var fs = require('fs-extra');
var path = require('path');
var debug = require('debug')('rwlockfile');
var mkdir = require('mkdirp');
var locks = {};
var readers = {};
function pidActive(pid) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!pid || isNaN(pid))
                return [2 /*return*/, false];
            return [2 /*return*/, process.platform === 'win32'
                    ? pidActiveWindows(pid)
                    : pidActiveUnix(pid)];
        });
    });
}
function pidActiveWindows(pid) {
    var ps = require('ps-node');
    return new Promise(function (resolve, reject) {
        ps.lookup({ pid: pid }, function (err, result) {
            if (err)
                return reject(err);
            resolve(result.length > 0);
        });
    });
}
function pidActiveUnix(pid) {
    try {
        return Boolean(process.kill(pid, 0));
    }
    catch (e) {
        return e.code === 'EPERM';
    }
}
function lockActive(path) {
    return __awaiter(this, void 0, void 0, function () {
        var file, pid, active, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, readFile(path)];
                case 1:
                    file = _a.sent();
                    pid = parseInt(file.trim());
                    active = pidActive(pid);
                    if (!active)
                        debug("stale pid " + path + " " + pid);
                    return [2 /*return*/, active];
                case 2:
                    err_1 = _a.sent();
                    if (err_1.code !== 'ENOENT')
                        throw err_1;
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function unlock(path) {
    return new Promise(function (resolve) { return fs.remove(path, resolve); }).then(function () {
        delete locks[path];
    });
}
function wait(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
function unlockSync(path) {
    try {
        fs.removeSync(path);
    }
    catch (err) {
        debug(err);
    }
    delete locks[path];
}
function lock(p, timeout) {
    var pidPath = path.join(p, 'pid');
    if (!fs.existsSync(path.dirname(p)))
        mkdir.sync(path.dirname(p));
    return new Promise(function (resolve, reject) {
        fs.mkdir(p, function (err) {
            if (!err) {
                locks[p] = 1;
                fs.writeFile(pidPath, process.pid.toString(), resolve);
                return;
            }
            if (err.code !== 'EEXIST')
                return reject(err);
            lockActive(pidPath)
                .then(function (active) {
                if (!active)
                    return unlock(p)
                        .then(resolve)
                        .catch(reject);
                if (timeout <= 0)
                    throw new Error(p + " is locked");
                debug("locking " + p + " " + timeout / 1000 + "s...");
                wait(1000).then(function () {
                    return lock(p, timeout - 1000)
                        .then(resolve)
                        .catch(reject);
                });
            })
                .catch(reject);
        });
    });
}
function readFile(path) {
    return new Promise(function (resolve, reject) {
        fs.readFile(path, 'utf8', function (err, body) {
            if (err)
                return reject(err);
            resolve(body);
        });
    });
}
function writeFile(path, content) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(path, content, function (err, body) {
            if (err)
                return reject(err);
            resolve(body);
        });
    });
}
function getReadersFile(path) {
    return __awaiter(this, void 0, void 0, function () {
        var f, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, readFile(path + '.readers')];
                case 1:
                    f = _a.sent();
                    return [2 /*return*/, f.split('\n').map(function (r) { return parseInt(r); })];
                case 2:
                    err_2 = _a.sent();
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getReadersFileSync(path) {
    try {
        var f = fs.readFileSync(path + '.readers', 'utf8');
        return f.split('\n').map(function (r) { return parseInt(r); });
    }
    catch (err) {
        return [];
    }
}
var unlink = function (p) {
    return new Promise(function (resolve, reject) {
        return fs.unlink(p, function (err) { return (err ? reject(err) : resolve()); });
    });
};
function saveReaders(path, readers) {
    path += '.readers';
    if (readers.length === 0) {
        return unlink(path).catch(function () { });
    }
    else {
        return writeFile(path, readers.join('\n'));
    }
}
function saveReadersSync(path, readers) {
    path += '.readers';
    try {
        if (readers.length === 0) {
            fs.unlinkSync(path);
        }
        else {
            fs.writeFileSync(path, readers.join('\n'));
        }
    }
    catch (err) { }
}
function getActiveReaders(path, timeout, skipOwnPid) {
    if (skipOwnPid === void 0) { skipOwnPid = false; }
    return __awaiter(this, void 0, void 0, function () {
        var readers, promises, activeReaders;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, lock(path + '.readers.lock', timeout)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, getReadersFile(path)];
                case 2:
                    readers = _a.sent();
                    promises = readers.map(function (r) {
                        return pidActive(r).then(function (active) { return (active ? r : null); });
                    });
                    return [4 /*yield*/, Promise.all(promises)];
                case 3:
                    activeReaders = _a.sent();
                    activeReaders = activeReaders.filter(function (r) { return r !== null; });
                    if (!(activeReaders.length !== readers.length)) return [3 /*break*/, 5];
                    return [4 /*yield*/, saveReaders(path, activeReaders)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [4 /*yield*/, unlock(path + '.readers.lock')];
                case 6:
                    _a.sent();
                    return [2 /*return*/, skipOwnPid
                            ? activeReaders.filter(function (r) { return r !== process.pid; })
                            : activeReaders];
            }
        });
    });
}
function waitForReaders(path, timeout, skipOwnPid) {
    return __awaiter(this, void 0, void 0, function () {
        var readers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getActiveReaders(path, timeout, skipOwnPid)];
                case 1:
                    readers = _a.sent();
                    if (!(readers.length !== 0)) return [3 /*break*/, 4];
                    if (timeout <= 0)
                        throw new Error(path + " is locked with " + (readers.length === 1 ? 'a reader' : 'readers') + " active: " + readers.join(' '));
                    debug("waiting for readers: " + readers.join(' ') + " timeout=" + timeout);
                    return [4 /*yield*/, wait(1000)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, waitForReaders(path, timeout - 1000, skipOwnPid)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function waitForWriter(path, timeout) {
    return hasWriter(path).then(function (active) {
        if (active) {
            if (timeout <= 0)
                throw new Error(path + " is locked with an active writer");
            debug("waiting for writer: path=" + path + " timeout=" + timeout);
            return wait(1000).then(function () { return waitForWriter(path, timeout - 1000); });
        }
        return unlock(path);
    });
}
function unread(path, timeout) {
    if (timeout === void 0) { timeout = 60000; }
    return __awaiter(this, void 0, void 0, function () {
        var readers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, lock(path + '.readers.lock', timeout)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, getReadersFile(path)];
                case 2:
                    readers = _a.sent();
                    if (!readers.find(function (r) { return r === process.pid; })) return [3 /*break*/, 4];
                    return [4 /*yield*/, saveReaders(path, readers.filter(function (r) { return r !== process.pid; }))];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [4 /*yield*/, unlock(path + '.readers.lock')];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.unread = unread;
function unreadSync(path) {
    // TODO: potential lock issue here since not using .readers.lock
    var readers = getReadersFileSync(path);
    saveReadersSync(path, readers.filter(function (r) { return r !== process.pid; }));
}
/**
 * lock for writing
 * @param path {string} - path of lockfile to use
 * @param options {object}
 * @param [options.timeout=60000] {number} - Max time to wait for lockfile to be open
 * @param [options.skipOwnPid] {boolean} - Do not wait on own pid (to upgrade current process)
 * @returns {Promise}
 */
function write(path, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var skipOwnPid, timeout;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    skipOwnPid = !!options.skipOwnPid;
                    timeout = options.timeout || 60000;
                    debug("write " + path);
                    return [4 /*yield*/, waitForReaders(path, timeout, skipOwnPid)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, lock(path + '.writer', timeout)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, function () { return unlock(path + '.writer'); }];
            }
        });
    });
}
exports.write = write;
/**
 * lock for reading
 * @param path {string} - path of lockfile to use
 * @param options {object}
 * @param [options.timeout=60000] {number} - Max time to wait for lockfile to be open
 * @returns {Promise}
 */
exports.read = function (path, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var timeout, readersFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    timeout = options.timeout || 60000;
                    debug("read " + path);
                    return [4 /*yield*/, waitForWriter(path, timeout)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, lock(path + '.readers.lock', timeout)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, getReadersFile(path)];
                case 3:
                    readersFile = _a.sent();
                    return [4 /*yield*/, saveReaders(path, readersFile.concat([process.pid]))];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, unlock(path + '.readers.lock')];
                case 5:
                    _a.sent();
                    readers[path] = 1;
                    return [2 /*return*/, function () { return unread(path, timeout); }];
            }
        });
    });
};
/**
 * check if active writer
 * @param path {string} - path of lockfile to use
 */
function hasWriter(p) {
    return __awaiter(this, void 0, void 0, function () {
        var pid, err_3, active;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, readFile(path.join(p + '.writer', 'pid'))];
                case 1:
                    pid = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _a.sent();
                    if (err_3.code !== 'ENOENT')
                        throw err_3;
                    return [3 /*break*/, 3];
                case 3:
                    if (!pid)
                        return [2 /*return*/, false];
                    return [4 /*yield*/, pidActive(parseInt(pid))];
                case 4:
                    active = _a.sent();
                    return [2 /*return*/, active];
            }
        });
    });
}
exports.hasWriter = hasWriter;
function hasReaders(p, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var timeout, skipOwnPid, readers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    timeout = options.timeout || 60000;
                    skipOwnPid = !!options.skipOwnPid;
                    return [4 /*yield*/, getActiveReaders(p, timeout, skipOwnPid)];
                case 1:
                    readers = _a.sent();
                    return [2 /*return*/, readers.length !== 0];
            }
        });
    });
}
exports.hasReaders = hasReaders;
function cleanup() {
    Object.keys(locks).forEach(unlockSync);
    Object.keys(readers).forEach(unreadSync);
}
exports.cleanup = cleanup;
process.once('exit', exports.cleanup);
//# sourceMappingURL=rwlockfile.js.map