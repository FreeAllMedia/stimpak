"use strict";

var _stimpak = require("../../lib/stimpak/stimpak.js");

describe("Source.glob()", function () {
	var source = void 0,
	    globString = void 0;

	beforeEach(function () {
		globString = "**/*";
		source = new _stimpak.Source(globString);
	});

	it("should set glob to the provided glob string", function () {
		source.glob().should.eql(globString);
	});

	it("should default to **/*", function () {
		source = new _stimpak.Source();
		source.glob().should.eql("**/*");
	});

	it("should be settable", function () {
		var newGlob = "*.json";
		source.glob(newGlob);
		source.glob().should.eql(newGlob);
	});

	it("should return stimpak when setting to enable chaining", function () {
		source.glob(globString).should.eql(source);
	});
});