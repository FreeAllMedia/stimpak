#!/usr/bin/env node
"use strict";

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _package = require("../../../package.json");

var _package2 = _interopRequireDefault(_package);

var _requireg = require("requireg");

var _requireg2 = _interopRequireDefault(_requireg);

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

		stimpak.answers(answers);

		for (var generator in generatorNames) {
			var generatorName = generatorNames[generator];
			var packageName = "stimpak-" + generatorName;
			try {
				var GeneratorConstructor = (0, _requireg2.default)(packageName).default;
				stimpak.use(GeneratorConstructor);
			} catch (error) {
				var _errorMessage = "\"" + generatorName + "\" is not installed. Use \"npm install " + packageName + " -g\"\n";
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