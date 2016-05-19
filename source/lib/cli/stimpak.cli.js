#!/usr/bin/env node
require("babel-polyfill");

import fileSystem from "fs";
import requireResolve from "require-resolve";
import packageJson from "../../../package.json";
import npmPaths from "global-paths";

const Stimpak = require(__dirname + "/../stimpak/stimpak.js").default;
const firstArgument = process.argv[2];

switch (firstArgument) {
	case "-V":
	case "--version":
		process.stdout.write(`${packageJson.version}\n`);
		break;
	case "-h":
	case "--help":
	case undefined:
		fileSystem
			.createReadStream(`${__dirname}/templates/help.txt`)
			.pipe(process.stdout);
			break;

	default:
		require("babel-register");

		const stimpak = new Stimpak()
			.destination(process.cwd());

		const lastArguments = process.argv.splice(2);
		const generatorNames = [];
		const answers = {};

		for (let argumentIndex in lastArguments) {
			const argument = lastArguments[argumentIndex];

			const hasAnswers = argument.indexOf("--") !== -1;

			if (hasAnswers) {
				const answerMatchData = /^--([^=]+)=(.*)$/.exec(argument);
				if (answerMatchData) {
					const answerName = answerMatchData[1];
					const answerValue = answerMatchData[2];
					answers[answerName] = answerValue;
				} else {
					const errorMessage = `The provided answer "${argument}" is malformed, please use "--key=value".\n`;
					process.stderr.write(errorMessage);
				}
			} else {
				generatorNames.push(argument);
			}
		}

		stimpak.answers(answers);

		generatorNames.forEach(generatorName => {
			const packageName = `stimpak-${generatorName}`;

			const packagePath = resolvePackagePath(packageName);

			if (packagePath) {
				const GeneratorConstructor = require(packagePath).default;
				stimpak.use(GeneratorConstructor);
			} else {
				const errorMessage = `"${generatorName}" is not installed. Use "npm install stimpak-${generatorName} -g"\n`;
				process.stderr.write(errorMessage);
			}
		});

		stimpak.generate(error => {
			if (error) { throw error; }
			const doneFileContents = fileSystem.readFileSync(`${__dirname}/templates/done.txt`, { encoding: "utf-8" });
			process.stdout.write(doneFileContents);
		});
}

function resolvePackagePath(packageName) {
	let found = false;
	npmPaths().forEach(npmPath => {
		const generatorFilePath = `${npmPath}/${packageName}`;

		if (fileSystem.existsSync(generatorFilePath)) {
			found = generatorFilePath;
		}
	});

	return found;
}
