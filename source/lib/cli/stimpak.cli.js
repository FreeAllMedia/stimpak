#!/usr/bin/env node
require("babel-polyfill");

import fileSystem from "fs-extra";
import packageJson from "../../../package.json";
import npmPaths from "global-paths";
import glob from "glob";
import path from "path";
import rimraf from "rimraf";
// import temp from "temp";

const Stimpak = require(__dirname + "/../stimpak/stimpak.js").default;
const firstArgument = process.argv[2];

let tempFiles = [];

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
		const nodeModulesDirectoryPath = path.normalize(`${__dirname}/../../../node_modules`);
		const npmPackageNames = glob.sync("*", { cwd: nodeModulesDirectoryPath });

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

		const generatorPaths = {};
		const packagePaths = [];
		generatorNames.forEach(generatorName => {
			const packageName = `stimpak-${generatorName}`;
			const packagePath = resolvePackagePath(packageName);

			packagePaths.push(packagePath);

			generatorPaths[packageName] = {
				generatorName: generatorName,
				path: packagePath
			};
		});

		const ignoreTranspilingPaths = glob
			.sync(`${nodeModulesDirectoryPath}/*`)
			.filter(npmPath => {
				let pathFound = false;
				packagePaths.forEach(packagePath => {
					if (npmPath === packagePath) {
						pathFound = true;
					}
				});
				return !pathFound;
			});

		require("babel-register")({
			ignore: ignoreTranspilingPaths
		});

		stimpak.answers(answers);

		process.on("exit", cleanupTempFiles);

		for (let packageName in generatorPaths) {
			const generatorPath = generatorPaths[packageName];
			const packagePath = generatorPath.path;
			const generatorName = generatorPath.generatorName;
			const packageNodeModulesDirectoryPath = `${packagePath}/node_modules`;

			fileSystem.mkdirsSync(packageNodeModulesDirectoryPath);

			if (packagePath) {
				npmPackageNames.forEach(npmPackageName => {
					linkDirectory(
						`${nodeModulesDirectoryPath}/${npmPackageName}`,
						`${packageNodeModulesDirectoryPath}/${npmPackageName}`
					);
				});

				const requirePath = packagePath;
				const GeneratorConstructor = require(requirePath).default;
				stimpak.use(GeneratorConstructor);
			} else {
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

function linkDirectory(fromPath, toPath) {
	if (fileSystem.existsSync(toPath)) {
		const fileStats = fileSystem.lstatSync(toPath);
		if (fileStats.isSymbolicLink()) {
			unlink(toPath);
			symlink(fromPath, toPath);
			tempFiles.push(toPath);
		}
	} else {
		symlink(fromPath, toPath);
	}
}

function symlink(fromPath, toPath) {
	fileSystem.symlinkSync(fromPath, toPath);
	addTempFile(toPath);
}

function unlink(filePath) {
	// HACK: Using rimraf.sync instead of fileSystem.unlinkSync because of weird behavior by unlinkSync. Rimraf is a slower solution, but it ensures that the file is completely removed before it moves on, unlinke unlinkSync: https://github.com/nodejs/node-v0.x-archive/issues/7164
	rimraf.sync(filePath);
	let index = tempFiles.indexOf(filePath);
	if (index > -1) {
		tempFiles = tempFiles.splice(index, 1);
	}
}

function addTempFile(filePath) {
	if (tempFiles.indexOf(filePath) === -1) {
		tempFiles.push(filePath);
	}
}

function cleanupTempFiles() {
	tempFiles.forEach(tempFile => {
		unlink(tempFile);
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
