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

var Stimpak = require(__dirname + "/../stimpak/stimpak.js").default;
var firstArgument = process.argv[2];

var tempFiles = [];
var movedFiles = {};

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
		var rootDirectoryPath = _path2.default.normalize(__dirname + "/../../..");
		var nodeModulesDirectoryPath = rootDirectoryPath + "/node_modules";

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

		stimpak.answers(answers);

		process.on("exit", cleanup);

		var npmPackageNames = _glob2.default.sync("*", { cwd: nodeModulesDirectoryPath });

		var requirePaths = [];

		var _loop = function _loop(packageName) {
			var generatorPath = generatorPaths[packageName];
			var packagePath = generatorPath.path;
			var generatorName = generatorPath.generatorName;
			var packageNodeModulesDirectoryPath = packagePath + "/node_modules";

			if (packagePath) {
				npmPackageNames.forEach(function (npmPackageName) {
					linkDirectory(nodeModulesDirectoryPath + "/" + npmPackageName, packageNodeModulesDirectoryPath + "/" + npmPackageName);
				});

				makeDirectory(packageNodeModulesDirectoryPath);

				var packageDirectoryPath = nodeModulesDirectoryPath + "/" + packageName;

				var requirePath = packagePath;

				if (packagePath !== packageDirectoryPath) {
					moveFile(packagePath, packageDirectoryPath);
					requirePath = packageDirectoryPath;
				}

				requirePaths.push(requirePath);
			} else {
				var _errorMessage = "\"" + generatorName + "\" is not installed. Use \"npm install " + packageName + " -g\"\n";
				process.stderr.write(_errorMessage);
			}
		};

		for (var packageName in generatorPaths) {
			_loop(packageName);
		}

		/*
  	Explanation of this monster glob:
  		* Get all files in all directories
  		* Inside of directories that don't have "stimpak" in their name
  		* Inside of a node_modules directory
  		* Anywhere inside of a directory that begins with "stimpak-"
  		* Inside of a node_modules directory
  		* Anywhere inside of the root directory
  */
		var ignoreTranspilingFilesGlob = rootDirectoryPath + "/**/@(node_modules)/stimpak-*/**/@(node_modules)/!(stimpak)*/**/*";
		require("babel-register")({
			ignore: ignoreTranspilingFilesGlob
		});

		var generatorConstructors = {};
		requirePaths.forEach(function (requirePath) {
			var GeneratorConstructor = generatorConstructors[requirePath];

			if (!GeneratorConstructor) {
				GeneratorConstructor = require(requirePath).default;
				generatorConstructors[requirePath] = GeneratorConstructor;
			}

			stimpak.use(GeneratorConstructor);
		});

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

function makeDirectory(directoryPath) {
	try {
		_fsExtra2.default.accessSync(directoryPath);
	} catch (exception) {
		console.log("WTF");
		_fsExtra2.default.mkdirsSync(directoryPath);
	}
}

function moveFile(fromPath, toPath) {
	if (!_fsExtra2.default.existsSync(toPath)) {
		fromPath = _fsExtra2.default.realpathSync(fromPath);
		_fsExtra2.default.renameSync(fromPath, toPath);
		movedFiles[toPath] = fromPath;
	}
}

function replaceFiles() {
	for (var toPath in movedFiles) {
		var fromPath = movedFiles[toPath];
		_fsExtra2.default.renameSync(toPath, fromPath);
	}
}

function symlink(fromPath, toPath) {
	_fsExtra2.default.symlinkSync(fromPath, toPath);
	addTempFile(toPath);
}

function unlink(filePath) {
	// HACK: Using rimraf.sync instead of fileSystem.unlinkSync because of weird behavior by unlinkSync. Rimraf is a slower solution, but it ensures that the file is completely removed before it moves on, unlinke unlinkSync: https://github.com/nodejs/node-v0.x-archive/issues/7164
	_rimraf2.default.sync(filePath);
	removeTempFile(filePath);
}

function addTempFile(filePath) {
	if (tempFiles.indexOf(filePath) === -1) {
		tempFiles.push(filePath);
	}
}

function removeTempFile(filePath) {
	var index = tempFiles.indexOf(filePath);
	if (index > -1) {
		tempFiles = tempFiles.splice(index, 1);
	}
}

function cleanup() {
	replaceFiles();
	cleanupTempFiles();
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