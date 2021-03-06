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
var stripAnsi = require("strip-ansi");
var SpinnerAction = /** @class */ (function (_super) {
    __extends(SpinnerAction, _super);
    function SpinnerAction(out) {
        var _this = _super.call(this, out) || this;
        _this.ansi = require('ansi-escapes');
        _this.frames = require('../spinners')[process.platform === 'win32' ? 'line' : 'dots2'].frames;
        _this.frameIndex = 0;
        var screen = require('./screen');
        _this.width = screen.errtermwidth;
        return _this;
    }
    SpinnerAction.prototype._start = function () {
        this._reset();
        if (this.spinner) {
            clearInterval(this.spinner);
        }
        this._render();
        var interval = (this.spinner = setInterval(this._render.bind(this), this.out.config.windows ? 500 : 100, 'spinner'));
        interval.unref();
    };
    SpinnerAction.prototype._stop = function () {
        clearInterval(this.spinner);
        this._render();
        this.output = null;
    };
    SpinnerAction.prototype._pause = function (icon) {
        clearInterval(this.spinner);
        this._reset();
        if (icon) {
            this._render(" " + icon);
        }
        this.output = null;
    };
    SpinnerAction.prototype._render = function (icon) {
        var task = this.task;
        if (!task) {
            return;
        }
        this._reset();
        var frame = icon === 'spinner' ? " " + this._frame() : icon || '';
        var status = task.status ? " " + task.status : '';
        var dots = task.status ? '' : '...';
        this.output = "" + task.action + status + dots + frame + "\n";
        this._write(this.output);
    };
    SpinnerAction.prototype._reset = function () {
        if (!this.output) {
            return;
        }
        var lines = this._lines(this.output);
        this._write(this.ansi.cursorLeft + this.ansi.cursorUp(lines) + this.ansi.eraseDown);
        this.output = null;
    };
    SpinnerAction.prototype._frame = function () {
        var frame = this.frames[this.frameIndex];
        this.frameIndex = ++this.frameIndex % this.frames.length;
        return this.out.color.prisma(frame);
    };
    SpinnerAction.prototype._lines = function (s) {
        var _this = this;
        return stripAnsi(s)
            .split('\n')
            .map(function (l) { return Math.ceil(l.length / _this.width); })
            .reduce(function (c, i) { return c + i; }, 0);
    };
    SpinnerAction.prototype._write = function (s) {
        this.out.stdout.write(s, { log: false });
    };
    return SpinnerAction;
}(ActionBase_1.ActionBase));
exports.SpinnerAction = SpinnerAction;
//# sourceMappingURL=SpinnerAction.js.map