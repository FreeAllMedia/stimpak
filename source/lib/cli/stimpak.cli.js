#!/usr/bin/env node
require("babel-polyfill");

import fileSystem from "fs";
import packageJson from "../../../package.json";
import npmPaths from "global-paths";
import temp from "temp";

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

		const temporaryDirectoryPath = temp.mkdirSync("no-globals-allowed-workaround");

		const stimpak = new Stimpak()
			.destination(process.cwd());

		const lastArguments = process.argv.splice(2);
		const generatorNames = [];
		const answers = {};

		const generatorPaths = {};

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

		generatorNames.forEach(generatorName => {
			const packageName = `stimpak-${generatorName}`;
			const packagePath = resolvePackagePath(packageName);
			generatorPaths[packageName] = {
				generatorName: generatorName,
				path: packagePath
			};
		});

		stimpak.answers(answers);

		process.on("exit", () => {
			replaceGenerators(generatorPaths);
		});

		try {
			for (let packageName in generatorPaths) {
				const packagePaths = generatorPaths[packageName];
				const packagePath = packagePaths.path;

				if (packagePath) {
					const temporaryModuleDirectoryPath = `${temporaryDirectoryPath}/${packageName}`;
					const wasCopied = moveDirectory(
						packagePath,
						temporaryModuleDirectoryPath
					);

					let requirePath;

					if (wasCopied) {
						packagePaths.copiedDirectoryPath = temporaryModuleDirectoryPath;
						requirePath = temporaryModuleDirectoryPath;
					} else {
						requirePath = packagePath;
					}

					const GeneratorConstructor = require(requirePath).default;
					stimpak.use(GeneratorConstructor);
				} else {
					const errorMessage = `"${packagePaths.generatorName}" is not installed. Use "npm install ${packageName} -g"\n`;
					process.stderr.write(errorMessage);
				}
			}

			stimpak.generate(error => {
				replaceGenerators(generatorPaths, error);

				const doneFileContents = fileSystem.readFileSync(`${__dirname}/templates/done.txt`, { encoding: "utf-8" });
				process.stdout.write(doneFileContents);
			});
		} catch (error) {
			replaceGenerators(generatorPaths, error);
		}
}

function moveDirectory(fromPath, toPath) {
	const fromPathStats = fileSystem.lstatSync(fromPath);
	if (fromPathStats.isSymbolicLink()) {
		return false;
	} else {
		fileSystem.renameSync(
			fromPath,
			toPath
		);
		return true;
	}
}

function replaceGenerators(generatorPaths, error) {
	for (let packageName in generatorPaths) {
		const packagePaths = generatorPaths[packageName];
		const packagePath = packagePaths.path;
		const copiedDirectoryPath = packagePaths.copiedDirectoryPath;

		if (copiedDirectoryPath) {
			moveDirectory(
				copiedDirectoryPath,
				packagePath
			);
		}
	}

	if (error) { throw error; }
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
