"use strict";

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _child_process = require("child_process");

var _temp = require("temp");

var _temp2 = _interopRequireDefault(_temp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("(CLI) stimpak generators", function () {
	var command = void 0,
	    temporaryDirectoryPath = void 0;

	beforeEach(function () {
		temporaryDirectoryPath = _temp2.default.mkdirSync("stimpak generators");

		var stimpakPath = _path2.default.normalize(__dirname + "/../../../es5/lib/cli/stimpak.cli.js");
		command = "node " + stimpakPath;
	});

	it("should throw an error if any of the generators aren't installed", function (done) {
		var invalidGeneratorName = "not-a-real-generator";
		command += " " + invalidGeneratorName;

		(0, _child_process.exec)(command, function (error, stdout, stderr) {
			var expectedStderr = "\"" + invalidGeneratorName + "\" is not installed. Use \"npm install stimpak-" + invalidGeneratorName + " -g\"";
			stderr.should.eql(expectedStderr);
			done();
		});
	});

	it("should call the designated generators by name", function (done) {
		command += " test-1";

		var expectedStdout = "Stimpak";

		(0, _child_process.exec)(command, { cwd: temporaryDirectoryPath }, function (error, stdout) {
			stdout.should.eql(expectedStdout);
			done(error);
		});
	});

	it("should use the current working directory as the destination", function (done) {
		command += " " + __dirname + "/fixtures/generator.js";
		var expectedFilePath = temporaryDirectoryPath + "/generated.js";

		(0, _child_process.exec)(command, { cwd: temporaryDirectoryPath }, function (error) {
			_fs2.default.existsSync(expectedFilePath).should.be.true;
			done(error);
		});
	});

	it("should print out when it's done");
	it("should run multiple designated generators");
	it("should throw an error returned by .generate");
});