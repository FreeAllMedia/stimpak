#!/usr/bin/env node
"use strict";

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _requireResolve = require("require-resolve");

var _requireResolve2 = _interopRequireDefault(_requireResolve);

var _package = require("../../../package.json");

var _package2 = _interopRequireDefault(_package);

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

		var stimpak = new Stimpak().destination(process.cwd());

		var lastArguments = process.argv.splice(2);
		var generatorNames = [];
		var answers = {};

		for (var argumentIndex in lastArguments) {
			var argument = lastArguments[argumentIndex];
			if (argument.indexOf("--") !== -1) {
				var matchData = /^--([^=]+)=(.*)$/.exec(argument);
				if (matchData) {
					answers[matchData[1]] = matchData[2];
				} else {
					var errorMessage = "The provided answer \"" + argument + "\" is malformed, please use \"--key=value\".\n";
					process.stderr.write(errorMessage);
				}
			} else {
				generatorNames.push(argument);
			}
		}

		stimpak.answers(answers);

		var moduleSearchDirectoryPath = process.cwd() + "/node_modules";

		generatorNames.forEach(function (generatorName) {
			var packageName = "stimpak-" + generatorName;

			try {
				var packageInfo = (0, _requireResolve2.default)(packageName, moduleSearchDirectoryPath);

				var GeneratorConstructor = void 0;
				if (packageInfo && packageInfo.src) {
					GeneratorConstructor = require(packageInfo.src).default;
				} else {
					GeneratorConstructor = require(packageName).default;
				}

				stimpak.use(GeneratorConstructor);
			} catch (error) {
				var _errorMessage = "\"" + generatorName + "\" is not installed. Use \"npm install stimpak-" + generatorName + " -g\"\n";
				process.stderr.write(_errorMessage);
			}
		});

		stimpak.generate(function (error) {
			if (error) {
				throw error;
			}
			var doneFileContents = _fs2.default.readFileSync(__dirname + "/templates/done.txt", { encoding: "utf-8" });
			process.stdout.write(doneFileContents);
		});
}