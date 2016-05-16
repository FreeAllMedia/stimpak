#!/usr/bin/env node
import fileSystem from "fs";
const Stimpak = require(__dirname + "/../stimpak/stimpak.js").default;
import requireResolve from "require-resolve";

const firstArgument = process.argv[2];

switch (firstArgument) {
	case "-h":
	case "--help":
	case undefined:
		fileSystem
			.createReadStream(`${__dirname}/templates/help.txt`)
			.pipe(process.stdout);
	break;
	default:
		const stimpak = new Stimpak()
			.destination(process.cwd());

		const lastArguments = process.argv.splice(2);
		const answers = [];

		for (let argumentIndex in lastArguments) {
			const argument = lastArguments[argumentIndex];
			if (argument.indexOf("--") !== -1) {
				answers.push(argument);
			} else {
				const generatorName = argument;
				const packageName = `stimpak-${generatorName}`;

				const packageInfo = requireResolve(packageName, `${process.cwd()}/node_modules`);
				try {
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
			}
		}

		stimpak.generate(error => {
			if (error) { throw error; }
			const doneFileContents = fileSystem.readFileSync(`${__dirname}/templates/done.txt`, { encoding: "utf-8" });
			process.stdout.write(doneFileContents);
		});
}
