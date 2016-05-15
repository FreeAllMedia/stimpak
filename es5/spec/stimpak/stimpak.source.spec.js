"use strict";

var _stimpak = require("../../lib/stimpak/stimpak.js");

var _stimpak2 = _interopRequireDefault(_stimpak);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("stimpak.source()", function () {
	var stimpak = void 0,
	    globString = void 0;

	beforeEach(function () {
		stimpak = new _stimpak2.default();

		globString = "**/*";
	});

	it("should return an instance of Source", function () {
		stimpak.source(globString).should.be.instanceOf(_stimpak.Source);
	});

	it("should add new instances to .sources", function () {
		var source = stimpak.source(globString);
		stimpak.sources.should.eql([source]);
	});
});