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
var chalk_1 = require("chalk");
var CommandReplacedError = /** @class */ (function (_super) {
    __extends(CommandReplacedError, _super);
    function CommandReplacedError(oldCmd, newCmd) {
        return _super.call(this, "The " + chalk_1.default.bold(oldCmd) + " command has been replaced by the " + chalk_1.default.bold(newCmd) + " command.\nGet more info with " + chalk_1.default.bold.green(newCmd + " --help")) || this;
    }
    return CommandReplacedError;
}(Error));
exports.CommandReplacedError = CommandReplacedError;
//# sourceMappingURL=CommandReplacedError.js.map