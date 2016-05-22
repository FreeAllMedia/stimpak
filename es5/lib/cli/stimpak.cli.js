#!/usr/bin/env node
"use strict";

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _package = require("../../../package.json");

var _package2 = _interopRequireDefault(_package);

var _globalPaths = require("global-paths");

var _globalPaths2 = _interopRequireDefault(_globalPaths);

var _temp = require("temp");

var _temp2 = _interopRequireDefault(_temp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("babel-polyfill");

var Stimpak = require(__dirname + "/../stimpak/stimpak.js").default;
var firstArgument = process.argv[2];

switch (firstArgument) {
	case "-V":
	case "--version":
		process.stdout.write(_package2.default.version + "\n");
		break;
	case "-h":
	case "--help":
	case undefined:
		_fs2.default.createReadStream(__dirname + "/templates/help.txt").pipe(process.stdout);
		break;

	default:
		require("babel-register");

		var temporaryDirectoryPath = _temp2.default.mkdirSync("no-globals-allowed-workaround");

		var stimpak = new Stimpak().destination(process.cwd());

		var lastArguments = process.argv.splice(2);
		var generatorNames = [];
		var answers = {};

		var generatorPaths = {};

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

		generatorNames.forEach(function (generatorName) {
			var packageName = "stimpak-" + generatorName;
			var packagePath = resolvePackagePath(packageName);
			generatorPaths[packageName] = {
				generatorName: generatorName,
				path: packagePath
			};
		});

		stimpak.answers(answers);

		process.on("exit", function () {
			replaceGenerators(generatorPaths);
		});

		for (var packageName in generatorPaths) {
			var packagePaths = generatorPaths[packageName];
			var packagePath = packagePaths.path;

			if (packagePath) {
				var temporaryModuleDirectoryPath = temporaryDirectoryPath + "/" + packageName;
				var wasCopied = moveDirectory(packagePath, temporaryModuleDirectoryPath);

				var requirePath = void 0;

				if (wasCopied) {
					packagePaths.copiedDirectoryPath = temporaryModuleDirectoryPath;
					requirePath = temporaryModuleDirectoryPath;
				} else {
					requirePath = packagePath;
				}

				var GeneratorConstructor = require(requirePath).default;
				stimpak.use(GeneratorConstructor);
			} else {
				var _errorMessage = "\"" + packagePaths.generatorName + "\" is not installed. Use \"npm install " + packageName + " -g\"\n";
				process.stderr.write(_errorMessage);
			}
		}

		stimpak.generate(function (error) {
			if (error) {
				throw error;
			}
			var doneFileContents = _fs2.default.readFileSync(__dirname + "/templates/done.txt", { encoding: "utf-8" });
			process.stdout.write(doneFileContents);
		});
}

function moveDirectory(fromPath, toPath) {
	var fromPathStats = _fs2.default.lstatSync(fromPath);
	if (fromPathStats.isSymbolicLink()) {
		return false;
	} else {
		_fs2.default.renameSync(fromPath, toPath);
		return true;
	}
}

function replaceGenerators(generatorPaths) {
	for (var _packageName in generatorPaths) {
		var _packagePaths = generatorPaths[_packageName];
		var _packagePath = _packagePaths.path;
		var copiedDirectoryPath = _packagePaths.copiedDirectoryPath;

		if (copiedDirectoryPath) {
			moveDirectory(copiedDirectoryPath, _packagePath);
		}
	}
}

function resolvePackagePath(packageName) {
	var found = false;
	(0, _globalPaths2.default)().forEach(function (npmPath) {
		var generatorFilePath = npmPath + "/" + packageName;

		if (_fs2.default.existsSync(generatorFilePath)) {
			found = generatorFilePath;
		}
	});

	return found;
}