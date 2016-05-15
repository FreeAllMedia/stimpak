"use strict";

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _child_process = require("child_process");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("(CLI) stimpak", function () {
	var command = void 0,
	    expectedStdout = void 0;

	beforeEach(function () {
		var helpFileTemplatePath = _path2.default.normalize(__dirname + "/../../lib/cli/templates/help.txt");

		expectedStdout = _fs2.default.readFileSync(helpFileTemplatePath, { encoding: "utf-8" });

		var stimpakPath = "./es5/lib/cli/stimpak.cli.js";
		command = "node " + stimpakPath;
	});

	it("should return the help page when called without arguments", function (done) {
		(0, _child_process.exec)(command, function (error, stdout) {
			stdout.should.eql(expectedStdout);
			done(error);
		});
	});

	it("should return the help page when called with the -h flag", function (done) {
		command += " -h";
		(0, _child_process.exec)(command, function (error, stdout) {
			stdout.should.eql(expectedStdout);
			done(error);
		});
	});

	it("should return the help page when called with the --help flag as the first argument", function (done) {
		command += " --help";
		(0, _child_process.exec)(command, function (error, stdout) {
			stdout.should.eql(expectedStdout);
			done(error);
		});
	});
});