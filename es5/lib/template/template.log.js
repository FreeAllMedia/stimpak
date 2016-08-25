"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = log;

var _util = require("util");

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function log(message, payload) {
	var debugStream = this.debug();
	if (debugStream) {
		var date = new Date().toISOString().slice(11, -5);
		var line = "[" + date + "] " + message + "\n";

		if (payload) {
			line += _util2.default.inspect(payload) + "\n";
		}

		debugStream.write(line);
	}

	return this;
}