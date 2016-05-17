"use strict";

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _child_process = require("child_process");

var _package = require("../../../package.json");

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("(CLI) stimpak --version", function () {
	var command = void 0,
	    expectedStdout = void 0;

	beforeEach(function () {
		var stimpakPath = "./es5/lib/cli/stimpak.cli.js";
		command = "node " + stimpakPath;
		expectedStdout = _package2.default.version + "\n";
	});

	it("should return the version number when called with the --version flag", function (done) {
		command += " --version";
		(0, _child_process.exec)(command, function (error, stdout) {
			stdout.should.eql(expectedStdout);
			done(error);
		});
	});

	it("should return the version number when called with the -V flag", function (done) {
		command += " -V";
		(0, _child_process.exec)(command, function (error, stdout) {
			stdout.should.eql(expectedStdout);
			done(error);
		});
	});
});