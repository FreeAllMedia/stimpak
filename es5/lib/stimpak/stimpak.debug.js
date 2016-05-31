"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = debug;

var _util = require("util");

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function debug(message, payload) {
	if (this.debugStream()) {
		var debugMessage = message;
		if (payload) {
			debugMessage += "(" + _util2.default.inspect(payload) + ")";
		}
		this.debugStream().write(debugMessage + "\n");
	}
	return this;
}