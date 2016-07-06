"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = cast;
function cast(callback) {
	var _this = this;

	return this.then(function (stimpak) {
		_this.casts(callback);
	});
}