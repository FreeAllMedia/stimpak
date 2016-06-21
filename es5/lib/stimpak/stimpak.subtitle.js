"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = subtitle;
function subtitle() {
	var message = arguments.length <= 0 || arguments[0] === undefined ? "Sub-Title" : arguments[0];

	this.debug("subtitle", message);

	this.then(function () {
		process.stdout.write("\n " + message + "\n");
	});

	return this;
}