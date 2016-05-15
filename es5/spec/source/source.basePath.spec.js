"use strict";

var _stimpak = require("../../lib/stimpak/stimpak.js");

describe("Source.basePath()", function () {
	var source = void 0,
	    globString = void 0;

	beforeEach(function () {
		globString = "**/*";
		source = new _stimpak.Source(globString);
	});

	it("should set basePath to directory by default", function () {
		source.basePath().should.eql(source.directory());
	});

	it("should be settable", function () {
		var newBasePath = "/some/directory";
		source.basePath(newBasePath);
		source.basePath().should.eql(newBasePath);
	});

	it("should return stimpak when setting to enable chaining", function () {
		source.basePath("/some/path").should.eql(source);
	});
});