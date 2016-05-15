"use strict";

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _child_process = require("child_process");

var _temp = require("temp");

var _temp2 = _interopRequireDefault(_temp);

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("(CLI) stimpak generators", function () {
	var command = void 0,
	    temporaryDirectoryPath = void 0;

	beforeEach(function () {
		temporaryDirectoryPath = _temp2.default.mkdirSync("stimpakgenerators");

		var projectRootPath = _path2.default.normalize(__dirname + "/../../../");

		var es5DirectoryPath = projectRootPath + "/es5";
		var nodeModulesDirectoryPath = temporaryDirectoryPath + "/node_modules";
		var nodeModulesFixtureDirectoryPath = es5DirectoryPath + "/spec/cli/fixtures/project/node_modules";
		var stimpakDirectoryPath = nodeModulesDirectoryPath + "/stimpak";
		var stimpakCliPath = stimpakDirectoryPath + "/es5/lib/cli/stimpak.cli.js";
		var generatorOneDirectoryPath = stimpakDirectoryPath + "/node_modules/stimpak-test-1";
		var generatorTwoDirectoryPath = stimpakDirectoryPath + "/node_modules/stimpak-test-2";
		var generatorThreeDirectoryPath = stimpakDirectoryPath + "/node_modules/stimpak-test-3";

		_fsExtra2.default.mkdirSync(nodeModulesDirectoryPath);

		_fsExtra2.default.symlinkSync(projectRootPath, stimpakDirectoryPath);

		try {
			_fsExtra2.default.unlinkSync(generatorOneDirectoryPath);
		} catch (error) {}
		try {
			_fsExtra2.default.unlinkSync(generatorTwoDirectoryPath);
		} catch (error) {}
		try {
			_fsExtra2.default.unlinkSync(generatorThreeDirectoryPath);
		} catch (error) {}

		_fsExtra2.default.symlinkSync(nodeModulesFixtureDirectoryPath + "/stimpak-test-1", generatorOneDirectoryPath);

		_fsExtra2.default.symlinkSync(nodeModulesFixtureDirectoryPath + "/stimpak-test-2", generatorTwoDirectoryPath);

		_fsExtra2.default.symlinkSync(nodeModulesFixtureDirectoryPath + "/stimpak-test-3", generatorThreeDirectoryPath);

		command = "node " + stimpakCliPath;
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

	it("should use the current working directory as the destination", function (done) {
		command += " test-1";
		var expectedFilePath = temporaryDirectoryPath + "/generated1.js";

		(0, _child_process.exec)(command, { cwd: temporaryDirectoryPath }, function (error) {
			_fsExtra2.default.existsSync(expectedFilePath).should.be.true;
			done(error);
		});
	});

	it("should print out the rendered done template on completion", function (done) {
		command += " test-1";

		var doneFileTemplatePath = _path2.default.normalize(__dirname + "/../../lib/cli/templates/done.txt");

		var expectedStdout = _fsExtra2.default.readFileSync(doneFileTemplatePath, { encoding: "utf-8" });

		(0, _child_process.exec)(command, { cwd: temporaryDirectoryPath }, function (error, stdout) {
			stdout.should.eql(expectedStdout);
			done(error);
		});
	});

	it("should run multiple designated generators", function (done) {
		command += " test-1 test-2";

		var expectedFilePath = temporaryDirectoryPath + "/generated2.js";

		(0, _child_process.exec)(command, { cwd: temporaryDirectoryPath }, function (error) {
			_fsExtra2.default.existsSync(expectedFilePath).should.be.true;
			done(error);
		});
	});

	it("should throw an error returned by .generate", function (done) {
		command += " test-3";

		(0, _child_process.exec)(command, { cwd: temporaryDirectoryPath }, function (error) {
			error.message.should.contain("Generator 3 Error!");
			done();
		});
	});
});