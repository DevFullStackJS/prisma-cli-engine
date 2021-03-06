"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var klaw = require("klaw-sync");
exports.topics = [
    { name: 'help', description: 'Print available commands and usage' },
    { name: 'version', description: 'Print version' },
];
exports.commands = klaw(__dirname, { nodir: true })
    .filter(function (f) { return f.path.endsWith('.js'); })
    .filter(function (f) { return !f.path.endsWith('.test.js'); })
    .filter(function (f) { return f.path !== __filename; })
    .map(function (f) { return require(f.path); });
//# sourceMappingURL=index.js.map