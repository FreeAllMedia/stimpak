"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = command;

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var _child_process = require("child_process");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function command(commandString, afterCommand) {
	var _this = this;

	var _ = (0, _incognito2.default)(this);
	console.log("FUM");
	_.action.step(function (stimpak, done) {
		console.log("FEE");
		(0, _child_process.exec)(commandString, function (error, stdout, stderr) {
			console.log("FI");
			afterCommand(_this, stdout, stderr, done);
		});
	});
	return this;
}