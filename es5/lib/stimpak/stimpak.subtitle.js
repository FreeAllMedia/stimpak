"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = subtitle;
function subtitle() {
	var _this = this;

	var message = arguments.length <= 0 || arguments[0] === undefined ? "Sub-Title" : arguments[0];

	this.debug("subtitle", message);

	this.then(function () {
		_this.write("\n " + message + "\n");
	});

	return this;
}