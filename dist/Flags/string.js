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
Object.defineProperty(exports, "__esModule", { value: true });
function string(options) {
    if (options === void 0) { options = {}; }
    return __assign({ parse: function (input) {
            if (input === void 0) { input = options.defaultValue; }
            return input;
        } }, options);
}
exports.default = string;
//# sourceMappingURL=string.js.map