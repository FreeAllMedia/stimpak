#!/usr/bin/env node
"use strict";

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _requireResolve = require("require-resolve");

var _requireResolve2 = _interopRequireDefault(_requireResolve);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Stimpak = require(__dirname + "/../stimpak/stimpak.js").default;


var firstArgument = process.argv[2];

switch (firstArgument) {
	case "-h":
	case "--help":
	case undefined:
		_fs2.default.createReadStream(__dirname + "/templates/help.txt").pipe(process.stdout);
		break;
	default:
		var stimpak = new Stimpak().destination(process.cwd());

		var lastArguments = process.argv.splice(2);
		var answers = [];

		for (var argumentIndex in lastArguments) {
			var argument = lastArguments[argumentIndex];
			if (argument.indexOf("--") !== -1) {
				answers.push(argument);
			} else {
				var generatorName = argument;
				var packageName = "stimpak-" + generatorName;

				var packageInfo = (0, _requireResolve2.default)(packageName, process.cwd() + "/node_modules");
				try {
					var GeneratorConstructor = void 0;
					if (packageInfo && packageInfo.src) {
						GeneratorConstructor = require(packageInfo.src).default;
					} else {
						GeneratorConstructor = require(packageName).default;
					}
					stimpak.use(GeneratorConstructor);
				} catch (error) {
					var errorMessage = "\"" + generatorName + "\" is not installed. Use \"npm install stimpak-" + generatorName + " -g\"\n";
					process.stderr.write(errorMessage);
				}
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