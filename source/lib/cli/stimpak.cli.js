#!/usr/bin/env node
require("babel-polyfill");

import fileSystem from "fs-extra";
import packageJson from "../../../package.json";
import npmPaths from "global-paths";
import glob from "glob";
import path from "path";
import rimraf from "rimraf";

const Stimpak = require(__dirname + "/../stimpak/stimpak.js").default;
const firstArgument = process.argv[2];

let tempFiles = [];
let movedFiles = {};

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
		const rootDirectoryPath = path.normalize(`${__dirname}/../../..`);
		const nodeModulesDirectoryPath = `${rootDirectoryPath}/node_modules`;

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

		stimpak.answers(answers);

		process.on("exit", cleanup);

		const npmPackageNames = glob.sync("*", { cwd: nodeModulesDirectoryPath });

		const requirePaths = [];
		for (let packageName in generatorPaths) {
			const generatorPath = generatorPaths[packageName];
			const packagePath = generatorPath.path;
			const generatorName = generatorPath.generatorName;
			const packageNodeModulesDirectoryPath = `${packagePath}/node_modules`;

			if (packagePath) {
				npmPackageNames.forEach(npmPackageName => {
					linkDirectory(
						`${nodeModulesDirectoryPath}/${npmPackageName}`,
						`${packageNodeModulesDirectoryPath}/${npmPackageName}`
					);
				});

				makeDirectory(packageNodeModulesDirectoryPath);

				const packageDirectoryPath = `${nodeModulesDirectoryPath}/${packageName}`;

				let requirePath = packagePath;

				if (packagePath !== packageDirectoryPath) {
					moveFile(packagePath, packageDirectoryPath);
					requirePath = packageDirectoryPath;
				}

				requirePaths.push(requirePath);
			} else {
				const errorMessage = `"${generatorName}" is not installed. Use "npm install ${packageName} -g"\n`;
				process.stderr.write(errorMessage);
			}
		}

		/*
			Explanation of this monster glob:
				* Get all files in all directories
				* Inside of directories that don't have "stimpak" in their name
				* Inside of a node_modules directory
				* Anywhere inside of a directory that begins with "stimpak-"
				* Inside of a node_modules directory
				* Anywhere inside of the root directory
		*/
		const ignoreTranspilingFilesGlob = `${rootDirectoryPath}/**/@(node_modules)/stimpak-*/**/@(node_modules)/!(stimpak)*/**/*`;
		require("babel-register")({
			ignore: ignoreTranspilingFilesGlob
		});

		const generatorConstructors = {};
		requirePaths.forEach(requirePath => {
			let GeneratorConstructor = generatorConstructors[requirePath];

			if (!GeneratorConstructor) {
				GeneratorConstructor = require(requirePath).default;
				generatorConstructors[requirePath] = GeneratorConstructor;
			}

			stimpak.use(GeneratorConstructor);
		});

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

function makeDirectory(directoryPath) {
	try {
		fileSystem.accessSync(directoryPath);
	} catch (exception) {
		console.log("WTF");
		fileSystem.mkdirsSync(directoryPath);
	}
}

function moveFile(fromPath, toPath) {
	if (!fileSystem.existsSync(toPath)) {
		fromPath = fileSystem.realpathSync(fromPath);
		fileSystem.renameSync(fromPath, toPath);
		movedFiles[toPath] = fromPath;
	}
}

function replaceFiles() {
	for (let toPath in movedFiles) {
		const fromPath = movedFiles[toPath];
		fileSystem.renameSync(toPath, fromPath);
	}
}

function symlink(fromPath, toPath) {
	fileSystem.symlinkSync(fromPath, toPath);
	addTempFile(toPath);
}

function unlink(filePath) {
	// HACK: Using rimraf.sync instead of fileSystem.unlinkSync because of weird behavior by unlinkSync. Rimraf is a slower solution, but it ensures that the file is completely removed before it moves on, unlinke unlinkSync: https://github.com/nodejs/node-v0.x-archive/issues/7164
	rimraf.sync(filePath);
	removeTempFile(filePath);
}

function addTempFile(filePath) {
	if (tempFiles.indexOf(filePath) === -1) {
		tempFiles.push(filePath);
	}
}

function removeTempFile(filePath) {
	let index = tempFiles.indexOf(filePath);
	if (index > -1) {
		tempFiles = tempFiles.splice(index, 1);
	}
}

function cleanup() {
	replaceFiles();
	cleanupTempFiles();
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
