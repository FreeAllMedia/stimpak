#!/usr/bin/env node
import fileSystem from "fs";
import Stimpak from "../stimpak/stimpak.js";

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
		const stimpak = new Stimpak();

		const lastArguments = process.argv.splice(2);
		const answers = [];

		for (let argumentIndex in lastArguments) {
			const argument = lastArguments[argumentIndex];
			if (argument.indexOf("--") !== -1) {
				answers.push(argument);
			} else {
				console.log("FEE");
				const generatorName = argument;
				const packagename = `stimpak-${generatorName}`;
				try {
					const GeneratorConstructor = require(packagename).default;
					console.log("FI", GeneratorConstructor);

					stimpak.use(GeneratorConstructor);
				} catch (error) {
					console.log("FO", error);
					const errorMessage = `"${generatorName}" is not installed. Use "npm install stimpak-${generatorName} -g"`;
					process.stderr.write(errorMessage);
				}
			}
		}

		stimpak.generate(error => {
			console.log("FUM");
			// if (error) { throw error; }
		});
}
