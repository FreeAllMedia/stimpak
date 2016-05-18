"use strict";

var _stimpak = require("../../lib/stimpak/stimpak.js");

describe("Source.directory()", function () {
	var source = void 0,
	    globString = void 0;

	beforeEach(function () {
		globString = "**/*";
		source = new _stimpak.Source(globString);
	});

	it("should set directory to the current working directory by default", function () {
		source.directory().should.eql(process.cwd());
	});

	it("should overwrite the default when set", function () {
		var newDirectory = "/some/directory";
		source.directory(newDirectory);
		source.directory().should.eql(newDirectory);
	});
});