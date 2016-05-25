import fileSystem from "fs-extra";
import packageJson from "../../../package.json";
import npmPaths from "global-paths";
import glob from "glob";
import path from "path";
import rimraf from "rimraf";
import privateData from "incognito";
import Async from "flowsync";

const Stimpak = require(__dirname + "/../stimpak/stimpak.js").default;

export default class StimpakCliRunner {
	constructor() {
		const _ = privateData(this);
		_.tempFiles = [];
		_.movedFiles = {};
		_.generatorConstructors = {};
		_.rootDirectoryPath = path.normalize(`${__dirname}/../../..`);
		_.nodeModulesDirectoryPath = `${_.rootDirectoryPath}/node_modules`;
		_.npmPackageNames = glob.sync("*", { cwd: _.nodeModulesDirectoryPath });
		process.on("exit", this.cleanup);
	}

	run(argv, callback) {
		this.routeCommand(argv, callback);
	}

	routeCommand(argv, callback) {
		const parsedArguments = this.parseArgv(argv);
		switch (parsedArguments.command) {
			case "-V":
			case "--version":
				this.showVersion(callback);
				break;
			case "-h":
			case "--help":
			case undefined:
				this.showHelp(callback);
				break;

			default:
				this.runGenerators(
					parsedArguments.generatorNames,
					this.showDone
				);
		}
	}

	initializeStimpak(answers) {
		const _ = privateData(this);
		_.stimpak = new Stimpak()
			.destination(process.cwd())
			.answers(answers);
	}

	runGenerators(generatorNames, answers, callback) {
		this.enableJustInTimeTranspiling();
		this.initializeStimpak(answers);

		const _ = privateData(this);

		Async.series([
			done => {
				this.loadGenerators(generatorNames, done);
			},
			done => {
				_.stimpak.generate(done);
			}
		], callback);
	}

	enableJustInTimeTranspiling() {
		/*
			Explanation of this monster glob (from right to left):
				* Get all files in all directories
				* Inside of directories that don't have "stimpak" in their name
				* Inside of a node_modules directory
				* Anywhere inside of a directory that begins with "stimpak-"
				* Inside of a node_modules directory
				* Anywhere inside of the root directory
		*/
		const rootDirectoryPath = privateData(this).rootDirectoryPath;
		let ignoreTranspilingFilesGlob = `${rootDirectoryPath}/**/@(node_modules)/stimpak-*/**/@(node_modules)/!(stimpak)*/**/*`;
		require("babel-register")({
			ignore: ignoreTranspilingFilesGlob
		});
	}

	loadGenerators(generatorNames, callback) {
		Async.mapSeries(
			generatorNames,
			this.loadGenerator,
			callback
		);
	}

	loadGenerator(generatorName, callback) {
		Async.waterfall([
			done => {
				this.resolveGeneratorPath(generatorName, done);
			},
			(generatorPath, done) => {
				this.setupGenerator(generatorName, generatorPath, done);
			}
		], callback);
	}

	setupGenerator(generatorName, generatorPath, callback) {
		const packageNodeModulesDirectoryPath = `${generatorPath}/node_modules`;
		Async.series([
			done => { this.makeDirectory(packageNodeModulesDirectoryPath, done); },
			done => { this.linkDependencies(packageNodeModulesDirectoryPath, done); },
			done => { this.moveGenerator(generatorName, generatorPath, done); },
			done => { this.useGenerator(generatorPath, done); }
		], callback);
	}

	linkDependencies(packageDirectoryPath, callback) {
		const _ = privateData(this);
		const nodeModulesDirectoryPath = _.nodeModulesDirectoryPath;
		Async.mapSeries(_.npmPackageNames, (npmPackageName, directoryLinked) => {
			this.linkDirectory(
				`${nodeModulesDirectoryPath}/${npmPackageName}`,
				`${packageDirectoryPath}/${npmPackageName}`,
				directoryLinked
			);
		}, callback);
	}

	moveGenerator(generatorName, generatorPath, callback) {
		const _ = privateData(this);
		const packageDirectoryPath = `${_.nodeModulesDirectoryPath}/${generatorName}`;

		if (generatorPath !== _.packageDirectoryPath) {
			this.moveFile(generatorPath, packageDirectoryPath, callback);
		}
	}

	useGenerator(generatorPath, callback) {
		const _ = privateData(this);

		const generatorConstructors = _.generatorConstructors;
		const stimpak = _.stimpak;

		try {
			let GeneratorConstructor = generatorConstructors[generatorPath];

			if (!GeneratorConstructor) {
				GeneratorConstructor = require(generatorPath).default;
				generatorConstructors[generatorPath] = GeneratorConstructor;
			}

			stimpak.use(GeneratorConstructor);

			callback();
		} catch (exception) {
			callback(exception);
		}
	}

	/**
	 * UTILITY METHODS
	 * TODO: Split these out into individual files
	 */
	linkDirectory(fromPath, toPath, callback) {
		Async.waterfall([
			done => { fileSystem.lstat(toPath, done); },
			(link, done) => {
				if (link) {
					if (link.isSymbolicLink()) {
						this.unlink(toPath, done);
					}
				} else {
					done();
				}
			},
			done => {	this.symlink(fromPath, toPath, done);	}
		], callback);
	}

	makeDirectory(directoryPath) {
		let stats = fileSystem.statSync(directoryPath);
		if (!stats.isDirectory()) {
			fileSystem.mkdirSync(directoryPath);
		}
	}

	moveFile(fromPath, toPath, callback) {
		const _ = privateData(this);
		Async.waterfall([
			done => { fileSystem.exists(toPath, done); },
			(fileExists, done) => {
				fileSystem.realpath(toPath, done);
			},
			(realPath, done) => {
				fileSystem.rename(realPath, toPath, error => {
					done(error, realPath);
					_.movedFiles[toPath] = realPath;
				});
			}
		], callback);
	}

	showVersion(callback) {
		process.stdout.write(`${packageJson.version}\n`);
		callback();
	}

	showHelp(callback) {
		fileSystem
			.createReadStream(`${__dirname}/templates/help.txt`)
			.pipe(process.stdout);
		callback();
	}

	showDone() {
		fileSystem.readFile(`${__dirname}/templates/done.txt`, { encoding: "utf-8" }, (error, fileContents) => {
			process.stdout.write(fileContents);
		});
	}

	parseArgv(argv) {
		const parsedArguments = {
			first: argv[2],
			remaining: argv.splice(2),
			generatorNames: [],
			answers: []
		};

		for (let argumentIndex in parsedArguments.remaining) {
			const argument = parsedArguments.remaining[argumentIndex];
			const isAnswer = argument.indexOf("--") !== -1;

			if (isAnswer) {
				const answerMatchData = /^--([^=]+)=(.*)$/.exec(argument);
				if (answerMatchData) {
					const answerName = answerMatchData[1];
					const answerValue = answerMatchData[2];
					parsedArguments.answers[answerName] = answerValue;
				} else {
					const errorMessage = `The provided answer "${argument}" is malformed, please use "--key=value".\n`;
					process.stderr.write(errorMessage);
				}
			} else {
				parsedArguments.generatorNames.push(argument);
			}
		}

		return parsedArguments;
	}

	generatorPackageName(generatorName) {
		return `stimpak-${generatorName}`;
	}

	resolveGeneratorPath(generatorName, callback) {
		const packageName = this.generatorPackageName(generatorName);
		this.resolvePackagePath(generatorName, packageName, callback);
	}

	moveFilesBack() {
		const _ = privateData(this);
		for (let toPath in _.movedFiles) {
			const fromPath = _.movedFiles[toPath];
			fileSystem.renameSync(toPath, fromPath);
		}
	}

	symlink(fromPath, toPath) {
		fileSystem.symlinkSync(fromPath, toPath);
		this.addTempFile(toPath);
	}

	unlink(filePath, callback) {
		// HACK: Using rimraf.sync instead of fileSystem.unlinkSync because of weird behavior by unlinkSync. Rimraf is a slower solution, but it ensures that the file is completely removed before it moves on, unlinke unlinkSync: https://github.com/nodejs/node-v0.x-archive/issues/7164
		rimraf(filePath, error => {
			this.removeTempFile(filePath);
			callback(error);
		});
	}

	addTempFile(filePath) {
		const _ = privateData(this);
		if (_.tempFiles.indexOf(filePath) === -1) {
			_.tempFiles.push(filePath);
		}
	}

	removeTempFile(filePath) {
		const _ = privateData(this);
		let index = _.tempFiles.indexOf(filePath);
		if (index > -1) {
			_.tempFiles = _.tempFiles.splice(index, 1);
		}
	}

	cleanup() {
		this.moveFilesBack();
		this.cleanupTempFiles();
	}

	cleanupTempFiles() {
		const _ = privateData(this);
		_.tempFiles.forEach(tempFile => {
			this.unlink(tempFile);
		});
	}

	resolvePackagePath(generatorName, packageName, callback) {
		let foundPackagePath = false;

		npmPaths().forEach(npmPath => {
			const generatorFilePath = `${npmPath}/${packageName}`;

			fileSystem.exists(generatorFilePath, (existsError, fileExists) => {
				if (!existsError) {
					if (fileExists) {
						foundPackagePath = generatorFilePath;
						callback(null, foundPackagePath);
					} else {
						const error = new Error(`"${generatorName}" is not installed. Use "npm install ${packageName} -g"\n`);
						callback(error, false);
					}
				} else {
					callback(existsError);
				}
			});
		});

		return foundPackagePath;
	}
}
