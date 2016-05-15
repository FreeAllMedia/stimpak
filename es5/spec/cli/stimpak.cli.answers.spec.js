"use strict";

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _child_process = require("child_process");

var _temp = require("temp");

var _temp2 = _interopRequireDefault(_temp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("(CLI) stimpak --answers", function () {
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

	it("should use provided answer and skip question prompt", function (done) {
		command += " test-4";
		(0, _child_process.exec)(command, function (error, stdout) {
			stdout.should.eql("");
			done();
		});
	});
});