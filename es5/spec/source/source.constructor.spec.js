"use strict";

var _stimpak = require("../../lib/stimpak/stimpak.js");

describe("Source.constructor()", function () {
	var source = void 0,
	    globString = void 0;

	beforeEach(function () {
		globString = "**/*";
		source = new _stimpak.Source(globString);
	});

	it("should return an instance of Source", function () {
		source.should.be.instanceOf(_stimpak.Source);
	});
});