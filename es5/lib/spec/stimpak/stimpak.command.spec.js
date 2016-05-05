"use strict";

var _stimpak = require("../../lib/stimpak/stimpak.js");

var _stimpak2 = _interopRequireDefault(_stimpak);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("stimpak.command()", function () {
	it("should return itself to enable chaining");
	it("should add its step to .steps");
	it("should run the command and callback with stdin");
	it("should run the command and callback with stdout");
	it("should run the command and callback with stderr");
});