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
var ActionBase_1 = require("./ActionBase");
var SimpleAction = /** @class */ (function (_super) {
    __extends(SimpleAction, _super);
    function SimpleAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SimpleAction.prototype._start = function () {
        var task = this.task;
        if (!task) {
            return;
        }
        this._render(task.action, task.status);
    };
    SimpleAction.prototype._pause = function (icon) {
        if (icon) {
            this._updateStatus(icon);
        }
        this._write('\n');
    };
    SimpleAction.prototype._resume = function () {
        // noop
    };
    SimpleAction.prototype._updateStatus = function (status, prevStatus) {
        var task = this.task;
        if (!task) {
            return;
        }
        if (task.active && !prevStatus) {
            this._write(" " + status);
        }
        else {
            this._render(task.action, status);
        }
    };
    SimpleAction.prototype._stop = function () {
        this._write('\n');
    };
    SimpleAction.prototype._render = function (action, status) {
        var task = this.task;
        if (!task) {
            return;
        }
        if (task.active) {
            this._write('\n');
        }
        this._write(status ? action + "... " + status : action + "...");
    };
    SimpleAction.prototype._write = function (s) {
        this.out.stdout.write(s, { log: false });
    };
    return SimpleAction;
}(ActionBase_1.ActionBase));
exports.SimpleAction = SimpleAction;
//# sourceMappingURL=SimpleAction.js.map