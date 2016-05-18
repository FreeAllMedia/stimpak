"use strict";

var _stimpak = require("../../lib/stimpak/stimpak.js");

var _stimpak2 = _interopRequireDefault(_stimpak);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("stimpak.destination()", function () {
	var stimpak = void 0,
	    path = void 0;

	beforeEach(function () {
		stimpak = new _stimpak2.default();

		path = "/path/to/destination/";
	});

	it("should return itself to enable chaining", function () {
		stimpak.destination(path).should.eql(stimpak);
	});

	it("should its value when there are no arguments", function () {
		stimpak.destination(path);
		stimpak.destination().should.eql(path);
	});
});