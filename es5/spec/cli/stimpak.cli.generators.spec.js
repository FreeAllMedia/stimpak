"use strict";

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _child_process = require("child_process");

var _stimpakCliHelper = require("./stimpak.cli.helper.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("(CLI) stimpak generators", function () {
	var command = void 0,
	    userProjectDirectoryPath = void 0;

	beforeEach(function () {
		var options = (0, _stimpakCliHelper.setupCliEnvironment)();
		command = options.command;
		userProjectDirectoryPath = options.userProjectDirectoryPath;
	});

	it("should throw an error if any of the generators aren't installed", function (done) {
		var invalidGeneratorName = "not-a-real-generator";
		command += " " + invalidGeneratorName;

		(0, _child_process.exec)(command, function (error, stdout, stderr) {
			var expectedStderr = "\"" + invalidGeneratorName + "\" is not installed. Use \"npm install stimpak-" + invalidGeneratorName + " -g\"\n";
			stderr.should.eql(expectedStderr);
			done();
		});
	});

	it("should use the current working directory as the destination", function (done) {
		command += " test-1";
		var expectedFilePath = userProjectDirectoryPath + "/generated1.js";

		(0, _child_process.exec)(command, { cwd: userProjectDirectoryPath }, function (error) {
			_fsExtra2.default.existsSync(expectedFilePath).should.be.true;
			done(error);
		});
	});

	it("should print out the rendered done template on completion", function (done) {
		command += " test-1";

		var doneFileTemplatePath = _path2.default.normalize(__dirname + "/../../lib/cli/templates/done.txt");

		var expectedStdout = _fsExtra2.default.readFileSync(doneFileTemplatePath, { encoding: "utf-8" });

		(0, _child_process.exec)(command, { cwd: userProjectDirectoryPath }, function (error, stdout) {
			stdout.should.eql(expectedStdout);
			done(error);
		});
	});

	it("should run multiple designated generators", function (done) {
		command += " test-1 test-2";

		var expectedFilePath = userProjectDirectoryPath + "/generated2.js";

		(0, _child_process.exec)(command, { cwd: userProjectDirectoryPath }, function (error) {
			_fsExtra2.default.existsSync(expectedFilePath).should.be.true;
			done(error);
		});
	});

	it("should throw an error returned by .generate", function (done) {
		command += " test-3";

		(0, _child_process.exec)(command, { cwd: userProjectDirectoryPath }, function (error) {
			error.message.should.contain("Generator 3 Error!");
			done();
		});
	});
});