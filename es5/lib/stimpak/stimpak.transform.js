"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = transform;
function transform(callback) {
	var _this = this;

	return this.then(function (stimpak) {
		_this.transforms(callback);
	});
}