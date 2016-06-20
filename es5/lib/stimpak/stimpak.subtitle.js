"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = subtitle;

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function subtitle() {
	var message = arguments.length <= 0 || arguments[0] === undefined ? "Sub-Title" : arguments[0];

	this.debug("subtitle", message);

	var needsLineBreak = Boolean((0, _incognito2.default)(this).needsLineBreak);

	this.then(function () {
		message = " " + message + "\n";
		if (needsLineBreak) {
			message = "\n" + message;
		}
		process.stdout.write(message);
	});

	return this;
}