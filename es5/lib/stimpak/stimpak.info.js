"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = info;

var _util = require("util");

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function info(message, payload) {
	var _this = this;

	this.then(function () {
		var infoMessage = message;
		if (payload) {
			infoMessage += "(" + _util2.default.inspect(payload) + ")";
		}
		_this.write("\n" + infoMessage + "\n");
	});
	return this;
}