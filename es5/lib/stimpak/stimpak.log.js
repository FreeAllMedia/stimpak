"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = log;

var _util = require("util");

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function log(message, payload) {
	var logMessage = message;
	if (payload) {
		logMessage += "(" + _util2.default.inspect(payload) + ")";
	}
	this.logStream().write(logMessage);
	return this;
}