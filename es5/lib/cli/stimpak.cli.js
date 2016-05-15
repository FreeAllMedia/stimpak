#!/usr/bin/env node
"use strict";

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _stimpak = require("../stimpak/stimpak.js");

var _stimpak2 = _interopRequireDefault(_stimpak);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var firstArgument = process.argv[2];

switch (firstArgument) {
	case "-h":
	case "--help":
	case undefined:
		_fs2.default.createReadStream(__dirname + "/templates/help.txt").pipe(process.stdout);
		break;
	default:
		var stimpak = new _stimpak2.default();

		var lastArguments = process.argv.splice(2);
		var answers = [];

		for (var argumentIndex in lastArguments) {
			var argument = lastArguments[argumentIndex];
			if (argument.indexOf("--") !== -1) {
				answers.push(argument);
			} else {
				console.log("FEE");
				var generatorName = argument;
				var packagename = "stimpak-" + generatorName;
				try {
					var GeneratorConstructor = require(packagename).default;
					console.log("FI", GeneratorConstructor);

					stimpak.use(GeneratorConstructor);
				} catch (error) {
					console.log("FO", error);
					var errorMessage = "\"" + generatorName + "\" is not installed. Use \"npm install stimpak-" + generatorName + " -g\"";
					process.stderr.write(errorMessage);
				}
			}
		}

		stimpak.generate(function (error) {
			console.log("FUM");
			// if (error) { throw error; }
		});
}