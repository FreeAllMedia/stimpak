"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = test;

var _temp = require("temp");

var _temp2 = _interopRequireDefault(_temp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function test() {
	this.debug("test");
	this.destination(_temp2.default.mkdirSync("stimpak-test"));
	return this;
}