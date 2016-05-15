"use strict";

var _stimpak = require("../../lib/stimpak/stimpak.js");

var _stimpak2 = _interopRequireDefault(_stimpak);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("stimpak.merge()", function () {
	var stimpak = void 0,
	    filePattern = void 0,
	    mergeFunction = void 0;

	beforeEach(function () {
		stimpak = new _stimpak2.default();

		filePattern = "/path/to/merge/";
		mergeFunction = _sinon2.default.spy(function (generator, oldFile, newFile, callback) {
			callback();
		});
	});

	it("should return itself to enable chaining when setting", function () {
		stimpak.merge(filePattern, mergeFunction).should.eql(stimpak);
	});

	it("should set multiple values at once", function () {
		stimpak.merge(filePattern, mergeFunction);
		stimpak.merge().should.eql([[filePattern, mergeFunction]]);
	});

	it("should aggregate multiple value sets", function () {
		stimpak.merge(filePattern, mergeFunction);
		stimpak.merge(filePattern, mergeFunction);
		stimpak.merge().should.eql([[filePattern, mergeFunction], [filePattern, mergeFunction]]);
	});

	it("should accept a regular expression for the file pattern", function () {
		filePattern = new RegExp(filePattern);

		stimpak.merge(filePattern, mergeFunction);

		stimpak.merge().should.eql([[filePattern, mergeFunction]]);
	});
});