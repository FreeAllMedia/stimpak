"use strict";

var _stimpak = require("../../lib/stimpak/stimpak.js");

var _stimpak2 = _interopRequireDefault(_stimpak);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("stimpak.answers", function () {
	var stimpak = void 0;

	beforeEach(function () {
		stimpak = new _stimpak2.default();
	});

	it("should be an empty object by default", function () {
		stimpak.answers.should.eql({});
	});
});