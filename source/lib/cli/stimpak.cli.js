#!/usr/bin/env node
require("babel-polyfill");

import fileSystem from "fs";
import requireResolve from "require-resolve";
import packageJson from "../../../package.json";

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
			if (argument.indexOf("--") !== -1) {
				const matchData = /^--([^=]+)=(.*)$/.exec(argument);
				if (matchData) {
					answers [matchData [1]] = matchData [2];
				} else {
					const errorMessage = `The provided answer "${argument}" is malformed, please use "--key=value".\n`;
					process.stderr.write(errorMessage);
				}
			} else {
				generatorNames.push(argument);
			}
		}

		stimpak.answers(answers);

		const moduleSearchDirectoryPath = `${process.cwd()}/node_modules`;

		generatorNames.forEach(generatorName => {
			const packageName = `stimpak-${generatorName}`;

			try {
				const packageInfo = requireResolve(packageName, moduleSearchDirectoryPath);

				let GeneratorConstructor;
				if (packageInfo && packageInfo.src) {
					GeneratorConstructor = require(packageInfo.src).default;
				} else {
					GeneratorConstructor = require(packageName).default;
				}

				stimpak.use(GeneratorConstructor);
			} catch (error) {
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
