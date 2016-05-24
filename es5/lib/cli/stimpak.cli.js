#!/usr/bin/env node
"use strict";

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _package = require("../../../package.json");

var _package2 = _interopRequireDefault(_package);

var _globalPaths = require("global-paths");

var _globalPaths2 = _interopRequireDefault(_globalPaths);

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _rimraf = require("rimraf");

var _rimraf2 = _interopRequireDefault(_rimraf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("babel-polyfill");

// import temp from "temp";

var Stimpak = require(__dirname + "/../stimpak/stimpak.js").default;
var firstArgument = process.argv[2];

var tempFiles = [];

switch (firstArgument) {
	case "-V":
	case "--version":
		process.stdout.write(_package2.default.version + "\n");
		break;
	case "-h":
	case "--help":
	case undefined:
		_fsExtra2.default.createReadStream(__dirname + "/templates/help.txt").pipe(process.stdout);
		break;

	default:
		var nodeModulesDirectoryPath = _path2.default.normalize(__dirname + "/../../../node_modules");
		var npmPackageNames = _glob2.default.sync("*", { cwd: nodeModulesDirectoryPath });

		var stimpak = new Stimpak().destination(process.cwd());

		var lastArguments = process.argv.splice(2);

		var generatorNames = [];
		var answers = {};
		for (var argumentIndex in lastArguments) {
			var argument = lastArguments[argumentIndex];

			var hasAnswers = argument.indexOf("--") !== -1;

			if (hasAnswers) {
				var answerMatchData = /^--([^=]+)=(.*)$/.exec(argument);
				if (answerMatchData) {
					var answerName = answerMatchData[1];
					var answerValue = answerMatchData[2];
					answers[answerName] = answerValue;
				} else {
					var errorMessage = "The provided answer \"" + argument + "\" is malformed, please use \"--key=value\".\n";
					process.stderr.write(errorMessage);
				}
			} else {
				generatorNames.push(argument);
			}
		}

		var generatorPaths = {};
		var packagePaths = [];
		generatorNames.forEach(function (generatorName) {
			var packageName = "stimpak-" + generatorName;
			var packagePath = resolvePackagePath(packageName);

			packagePaths.push(packagePath);

			generatorPaths[packageName] = {
				generatorName: generatorName,
				path: packagePath
			};
		});

		var ignoreTranspilingPaths = _glob2.default.sync(nodeModulesDirectoryPath + "/*").filter(function (npmPath) {
			var pathFound = false;
			packagePaths.forEach(function (packagePath) {
				if (npmPath === packagePath) {
					pathFound = true;
				}
			});
			return !pathFound;
		});

		require("babel-register")({
			ignore: ignoreTranspilingPaths
		});

		stimpak.answers(answers);

		process.on("exit", cleanupTempFiles);

		var _loop = function _loop(packageName) {
			var generatorPath = generatorPaths[packageName];
			var packagePath = generatorPath.path;
			var generatorName = generatorPath.generatorName;
			var packageNodeModulesDirectoryPath = packagePath + "/node_modules";

			_fsExtra2.default.mkdirsSync(packageNodeModulesDirectoryPath);

			if (packagePath) {
				npmPackageNames.forEach(function (npmPackageName) {
					linkDirectory(nodeModulesDirectoryPath + "/" + npmPackageName, packageNodeModulesDirectoryPath + "/" + npmPackageName);
				});

				var requirePath = packagePath;
				var GeneratorConstructor = require(requirePath).default;
				stimpak.use(GeneratorConstructor);
			} else {
				var _errorMessage = "\"" + generatorName + "\" is not installed. Use \"npm install " + packageName + " -g\"\n";
				process.stderr.write(_errorMessage);
			}
		};

		for (var packageName in generatorPaths) {
			_loop(packageName);
		}

		stimpak.generate(function (error) {
			if (error) {
				throw error;
			}
			var doneFileContents = _fsExtra2.default.readFileSync(__dirname + "/templates/done.txt", { encoding: "utf-8" });
			process.stdout.write(doneFileContents);
		});
}

function linkDirectory(fromPath, toPath) {
	if (_fsExtra2.default.existsSync(toPath)) {
		var fileStats = _fsExtra2.default.lstatSync(toPath);
		if (fileStats.isSymbolicLink()) {
			unlink(toPath);
			symlink(fromPath, toPath);
			tempFiles.push(toPath);
		}
	} else {
		symlink(fromPath, toPath);
	}
}

function symlink(fromPath, toPath) {
	_fsExtra2.default.symlinkSync(fromPath, toPath);
	addTempFile(toPath);
}

function unlink(filePath) {
	// HACK: Using rimraf.sync instead of fileSystem.unlinkSync because of weird behavior by unlinkSync. Rimraf is a slower solution, but it ensures that the file is completely removed before it moves on, unlinke unlinkSync: https://github.com/nodejs/node-v0.x-archive/issues/7164
	_rimraf2.default.sync(filePath);
	var index = tempFiles.indexOf(filePath);
	if (index > -1) {
		tempFiles = tempFiles.splice(index, 1);
	}
}

function addTempFile(filePath) {
	if (tempFiles.indexOf(filePath) === -1) {
		tempFiles.push(filePath);
	}
}

function cleanupTempFiles() {
	tempFiles.forEach(function (tempFile) {
		unlink(tempFile);
	});
}

function resolvePackagePath(packageName) {
	var found = false;

	(0, _globalPaths2.default)().forEach(function (npmPath) {
		var generatorFilePath = npmPath + "/" + packageName;

		if (_fsExtra2.default.existsSync(generatorFilePath)) {
			found = generatorFilePath;
		}
	});

	return found;
}