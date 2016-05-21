#!/usr/bin/env node
require("babel-polyfill");

import fileSystem from "fs";
import packageJson from "../../../package.json";
import requireg from "requireg";

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

		for (let generator in generatorNames) {
			const generatorName = generatorNames[generator];
			const packageName   = `stimpak-${generatorName}`;
			try {
				const GeneratorConstructor = requireg(packageName).default;
				stimpak.use(GeneratorConstructor);
			} catch (error) {
				const errorMessage = `"${generatorName}" is not installed. Use "npm install ${packageName} -g"\n`;
				process.stderr.write(errorMessage);
			}
		}

		stimpak.generate(error => {
			if (error) { throw error; }
			const doneFileContents = fileSystem.readFileSync(`${__dirname}/templates/done.txt`, { encoding: "utf-8" });
			process.stdout.write(doneFileContents);
		});
}
