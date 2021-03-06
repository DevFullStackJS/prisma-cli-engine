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
function number(options) {
    if (options === void 0) { options = {}; }
    return __assign({}, options, { parse: function (input) {
            if (input === void 0) { input = options.defaultValue; }
            return parseInt(input, 10);
        } });
}
exports.default = number;
//# sourceMappingURL=number.js.map