"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = test;

var _temp = require("temp");

var _temp2 = _interopRequireDefault(_temp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//temp.track();

function test() {
	this.write = function () {};

	this.debug("test");
	this.destination(_temp2.default.mkdirSync("stimpak-test"));
	return this;
}