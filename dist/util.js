"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var screen_1 = require("./Output/actions/screen");
var path = require("path");
var debug = require('debug')('util');
function compare() {
    var props = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        props[_i] = arguments[_i];
    }
    return function (a, b) {
        for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
            var prop = props_1[_i];
            if (a[prop] === undefined) {
                return -1;
            }
            if (b[prop] === undefined) {
                return 1;
            }
            if (a[prop] < b[prop]) {
                return -1;
            }
            if (a[prop] > b[prop]) {
                return 1;
            }
        }
        return 0;
    };
}
exports.compare = compare;
function wait(ms, unref) {
    if (unref === void 0) { unref = false; }
    return new Promise(function (resolve) {
        var t = setTimeout(resolve, ms);
        if (unref && typeof t.unref === 'function') {
            t.unref();
        }
    });
}
exports.wait = wait;
function timeout(p, ms) {
    return Promise.race([p, wait(ms, true).then(function () { return debug('timed out'); })]);
}
exports.timeout = timeout;
function undefault(m) {
    return m.default ? m.default : m;
}
exports.undefault = undefault;
function linewrap(length, s) {
    var linewrapOverride = require('@heroku/linewrap');
    return linewrapOverride(length, screen_1.stdtermwidth, {
        skipScheme: 'ansi-color',
    })(s).trim();
}
exports.linewrap = linewrap;
function getCommandId(argv) {
    if (argv.length === 1 && ['-v', '--version'].includes(argv[0])) {
        return 'version';
    }
    if (argv.includes('help')) {
        return 'help';
    }
    if (argv[1] && !argv[1].startsWith('-')) {
        return argv.slice(0, 2).join(':');
    }
    else {
        var firstFlag = argv.findIndex(function (param) { return param.startsWith('-'); });
        if (firstFlag === -1) {
            return argv.join(':');
        }
        else {
            return argv.slice(0, firstFlag).join(':');
        }
    }
}
exports.getCommandId = getCommandId;
function getRoot() {
    var parentFilename = module.parent.parent
        ? module.parent.parent.filename
        : module.parent.filename;
    var findUp = require('find-up');
    return path.dirname(findUp.sync('package.json', {
        cwd: parentFilename,
    }));
}
exports.getRoot = getRoot;
function filterObject(obj, cb) {
    var newObj = {};
    for (var key in obj) {
        var value = obj[key];
        if (obj.hasOwnProperty(key) && cb(key, value)) {
            newObj[key] = value;
        }
    }
    return newObj;
}
exports.filterObject = filterObject;
//# sourceMappingURL=util.js.map