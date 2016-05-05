"use strict";

var _stimpak = require("../../lib/stimpak/stimpak.js");

var _stimpak2 = _interopRequireDefault(_stimpak);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("Stimpak.constructor()", function () {
	var stimpak = void 0;

	beforeEach(function () {
		stimpak = new _stimpak2.default();
	});

	it("should return an instance of Stimpak", function () {
		stimpak.should.be.instanceOf(_stimpak2.default);
	});
});