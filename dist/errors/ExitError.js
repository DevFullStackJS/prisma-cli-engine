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
Object.defineProperty(exports, "__esModule", { value: true });
var ExitError = /** @class */ (function (_super) {
    __extends(ExitError, _super);
    function ExitError(code) {
        var _this = _super.call(this, "Exited with code: " + code) || this;
        _this.code = code;
        return _this;
    }
    return ExitError;
}(Error));
exports.default = ExitError;
//# sourceMappingURL=ExitError.js.map