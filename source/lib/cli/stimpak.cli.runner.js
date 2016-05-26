import fileSystem from "fs-extra";
import packageJson from "../../../package.json";
import npmPaths from "global-paths";
import glob from "glob";
import path from "path";
import rimraf from "rimraf";
import privateData from "incognito";
import Async from "flowsync";

const Stimpak = require(__dirname + "/../stimpak/stimpak.js").default;

let tempFiles = [],
	movedFiles = {};

function cleanup() {
	cleanupTempFiles(() => {
		moveFilesBack(() => {
		// Process exits here
		});
	});
}

function moveFilesBack(callback) {
	Async.mapSeries(Object.keys(movedFiles), (toPath, done) => {
		const fromPath = movedFiles[toPath];
		fileSystem.rename(toPath, fromPath, () => {
			delete movedFiles[toPath];
			done();
		});
	}, callback);
}

function cleanupTempFiles(callback) {
	Async.mapSeries(tempFiles, (tempFile, done) => {
		deleteFiles(tempFile, done);
	}, callback);
}

function deleteFiles(filePath, callback) {
	if (filePath) {
		rimraf(filePath, error => {
			removeTempFile(filePath);
			callback(error);
		});
	} else {
		callback();
	}
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

process.on("exit", cleanup);

export default class StimpakCliRunner {
	constructor() {
		const _ = privateData(this);
		_.generatorConstructors = {};
		_.rootDirectoryPath = path.normalize(`${__dirname}/../../..`);
		_.nodeModulesDirectoryPath = `${_.rootDirectoryPath}/node_modules`;
		_.npmPackageNames = glob.sync("*", { cwd: _.nodeModulesDirectoryPath });
	}

	run(argv, callback) {
		this.routeCommand(argv, callback);
	}

	routeCommand(argv, callback) {
		const parsedArguments = this.parseArgv(argv);
		switch (parsedArguments.first) {
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
					parsedArguments.answers,
					error => {
						if (!error) {
							this.showDone(callback);
						} else {
							callback(error);
						}
					}
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
			this.loadGenerator.bind(this),
			callback
		);
	}

	loadGenerator(generatorName, callback) {
		Async.waterfall([
			done => {
				this.resolveGeneratorPath(generatorName, done);
			},
			(generatorPath, done) => {
				this.setupGenerator(generatorName, generatorPath, error => {
					done(error, generatorPath);
				});
			},
			(generatorPath, done) => {
				this.useGenerator(generatorName, generatorPath, done);
			}
		], callback);
	}

	setupGenerator(generatorName, generatorPath, callback) {
		const packageNodeModulesDirectoryPath = `${generatorPath}/node_modules`;
		Async.series([
			done => { this.makeDirectory(packageNodeModulesDirectoryPath, done); },
			done => { this.linkDependencies(packageNodeModulesDirectoryPath, done); }
		], callback);
	}

	linkDependencies(packageDirectoryPath, callback) {
		const _ = privateData(this);
		const nodeModulesDirectoryPath = _.nodeModulesDirectoryPath;
		const npmPackageNames = _.npmPackageNames;
		Async.mapSeries(npmPackageNames, (npmPackageName, directoryLinked) => {
			this.linkDirectory(
				`${nodeModulesDirectoryPath}/${npmPackageName}`,
				`${packageDirectoryPath}/${npmPackageName}`,
				directoryLinked
			);
		}, callback);
	}

	packageDirectoryPath(generatorName) {
		const _ = privateData(this);
		const packageName = this.generatorPackageName(generatorName);
		return `${_.nodeModulesDirectoryPath}/${packageName}`;
	}

	useGenerator(generatorName, generatorPath, callback) {
		const _ = privateData(this);

		const generatorConstructors = _.generatorConstructors;
		const stimpak = _.stimpak;

		const packageDirectoryPath = this.packageDirectoryPath(generatorName);
		Async.series([
			done => {
				if (generatorPath !== packageDirectoryPath) {
					this.moveFiles(generatorPath, packageDirectoryPath, done);
				} else {
					done();
				}
			},
			done => {
				let GeneratorConstructor = generatorConstructors[packageDirectoryPath];

				try {
					if (!GeneratorConstructor) {
						GeneratorConstructor = require(packageDirectoryPath).default;
						generatorConstructors[packageDirectoryPath] = GeneratorConstructor;
					}

					stimpak.use(GeneratorConstructor);
					done();
				} catch (exception) {
					done(exception);
				}
			},
			done => {
				cleanupTempFiles(() => {
					moveFilesBack(done);
				});
			}
		], callback);
	}

	/**
	 * UTILITY METHODS
	 * TODO: Split these out into individual files
	 */
	linkDirectory(fromPath, toPath, callback) {
		Async.waterfall([
			done => {
				fileSystem.lstat(toPath, (error, stats) => {
					if (error) {
						done(null, null);
					} else {
						done(null, stats);
					}
				});
			},
			(link, done) => {
				if (link) {
					if (link.isSymbolicLink()) {
						deleteFiles(toPath, done);
					} else {
						done();
					}
				} else {
					done();
				}
			},
			done => {	this.symlink(fromPath, toPath, done);	}
		], callback);
	}

	makeDirectory(directoryPath, callback) {
		fileSystem.stat(directoryPath, (error, stats) => {
			if (!error) {
				if (!stats.isDirectory()) {
					fileSystem.mkdir(directoryPath, callback);
				} else {
					callback();
				}
			} else {
				callback(error);
			}
		});
	}

	moveFiles(fromPath, toPath, callback) {
		fileSystem.exists(toPath, fileExists => {
			if (!fileExists) {
				Async.waterfall([
					done => {
						fileSystem.realpath(fromPath, done);
					},
					(realPath, done) => {
						fileSystem.rename(realPath, toPath, error => {
							done(error, realPath);
							movedFiles[toPath] = realPath;
						});
					}
				], callback);
			} else {
				callback();
			}
		});
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

	showDone(callback) {
		fileSystem.readFile(`${__dirname}/templates/done.txt`, { encoding: "utf-8" }, (error, fileContents) => {
			process.stdout.write(fileContents);
			callback(error);
		});
	}

	parseArgv(argv) {
		const parsedArguments = {
			first: argv[2],
			remaining: argv.splice(2),
			generatorNames: [],
			answers: {}
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

	resolvePackagePath(generatorName, packageName, callback) {

		Async.mapSeries(npmPaths(), (npmPath, done) => {

			const generatorFilePath = `${npmPath}/${packageName}`;
			fileSystem.exists(generatorFilePath, fileExists => {

				if (fileExists) {

					done(null, generatorFilePath);
				} else {

					done(null);
				}
			});
		}, (existsError, paths) => {
			paths = paths.filter(foundPath => { return foundPath !== undefined; });

			if (!existsError) {

				const firstPathFound = paths[0];
				if (firstPathFound) {

					callback(null, firstPathFound);
				} else {

					const error = new Error(`"${generatorName}" is not installed. Use "npm install ${packageName} -g"\n`);
					callback(error);
				}
			} else {

				callback(existsError);
			}
		});
	}

	symlink(fromPath, toPath, callback) {
		fileSystem.symlink(fromPath, toPath, error => {
			addTempFile(toPath);
			callback(error);
		});
	}
}
