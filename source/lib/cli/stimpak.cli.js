#!/usr/bin/env node
require("babel-polyfill");

/**
 * It all starts with calling `.runCommand()`
 */
run(error => {
	if (error) {
		resetGenerators(() => {
			throw error;
		});
	}
});

/**
 * On process "exit", reset generators.
 */
process.on("beforeExit", () => {
	resetGenerators(() => {
		process.exit();
	});
});

/* -------------------------------------------------------------------------- */

/**
 * 3rd-Party Dependencies
 */
import fileSystem from "fs-extra";
import npmPaths from "global-paths";
import glob from "glob";
import path from "path";
import rimraf from "rimraf";
import Async from "flowsync";
import { exec } from "child_process";
import colors from "colors";
import util from "util";

/**
 * Local Dependencies
 */
import packageJson from "../../../package.json";
const Stimpak = require(__dirname + "/../stimpak/stimpak.js").default;

/**
 * Constants
 */
const parsedArguments = parseArgv(process.argv);

const stimpak = new Stimpak()
	.destination(process.cwd())
	.answers(parsedArguments.answers);

/**
 * Variables
 */
let generators = {},
		temporaryDependencyPaths = [],
		globalNodeModulesDirectory,
		rootDirectoryPath = path.normalize(`${__dirname}/../../..`),
		nodeModulesDirectoryPath = `${rootDirectoryPath}/node_modules`,
		npmPackageNames = glob.sync("*", { cwd: nodeModulesDirectoryPath }),
		showDebugInformation = false;

/** ------------------------------------------------------------------------ **/

export function run(callback) {
	debug(".run");

	Async.series([
		done => { determineGlobalNodeModulesDirectory(done); },
		done => { routeCommand(done); }
	], callback);
}

function routeCommand(callback) {
	debug(".routeCommand");

	switch (parsedArguments.first) {
		case "-V":
		case "--version":
			showVersion(callback);
			break;

		case "-h":
		case "--help":
		case undefined:
			showHelp(callback);
			break;

		default:
			enableJustInTimeTranspiling();
			runGenerators(
				(error) => {
					if (!error) {
						showDone(callback);
					} else {
						callback(error);
					}
				}
			);
	}
}

function enableJustInTimeTranspiling() {
	require("babel-register")({
		ignore: [
			`${rootDirectoryPath}/generators/**/node_modules/!(stimpak)*/**/*.*`,
			`${rootDirectoryPath}/node_modules/**/*`
		]
	});
}

function determineGlobalNodeModulesDirectory(callback) {
	debug(".determineGlobalNodeModulesDirectory");

	exec("npm config get prefix", (error, stdout) => {
		globalNodeModulesDirectory =
			stdout
				.toString()
				.replace(/[\n\r]/, "/lib/node_modules");

		debugCallback("globalNodeModulesDirectory", globalNodeModulesDirectory);

		callback();
	});
}

function runGenerators(callback) {
	debug(".runGenerators");

	Async.series([
		done => { loadGenerators(parsedArguments.generatorNames, done); },
		done => { generateFiles(done); }
	], callback);
}

function generateFiles(callback) {
	try {
		stimpak.generate(callback);
	} catch (exception) {
		callback(exception);
	}
}

function loadGenerators(generatorNames, callback) {
	debug(".loadGenerators", generatorNames);

	Async.mapSeries(
		generatorNames,
		loadGenerator.bind(this),
		callback
	);
}

function loadGenerator(generatorName, callback) {
	debug(".loadGenerator", generatorName);

	const generator = generators[generatorName] = {
		name: generatorName,
		packageName: generatorPackageName(generatorName)
	};

	Async.series([
		done => { resolveGeneratorPaths(generator, done); },
		done => { makeDirectory(generator.paths.nodeModulesDirectory, done); },
		done => { linkDependencies(generator, done); },
		done => { linkOrMoveIfGlobalGenerator(generator, done); },
		done => { requireGenerator(generator, done); }
	], callback);
}

function linkOrMoveIfGlobalGenerator(generator, callback) {
	debug(".linkOrMoveIfGlobalGenerator", generator);

	const originalDirectory = generator.paths.originalDirectory;
	const temporaryDirectory = generator.paths.temporaryDirectory;

	if (isGlobalGenerator(generator)) {
		moveDirectory(originalDirectory, temporaryDirectory, error => {
			generator.paths.currentDirectory = temporaryDirectory;
			callback(error);
		});
	} else {
		forceSymlink(originalDirectory, temporaryDirectory, callback);
	}
}

function forceSymlink(fromPath, toPath, callback) {
	fileSystem.exists(toPath, exists => {
		if (!exists) {
			symlink(fromPath, toPath, error => {
				callback(error);
			});
		} else {
			Async.series([
				done => { deleteFiles(toPath, done); },
				done => {
					symlink(fromPath, toPath, error => {
						done(error);
					});
				}
			], callback);
		}
	});
}

function requireGenerator(generator, callback) {
	debug(".requireGenerator", generator);

	try {
		if (!generator.Constructor) {
			generator.Constructor = require(generator.paths.temporaryDirectory).default;
		}

		stimpak.use(generator.Constructor);

		callback();
	} catch (exception) {
		callback(exception);
	}
}

function resetGenerators(callback) {
	debug(".resetGenerators");

	Async.mapSeries(Object.keys(generators), (generatorName, done) => {
		const generator = generators[generatorName];
		resetGenerator(generator, done);
	}, error => {
		if (callback) {
			callback(error);
		}
	});
}

function resetGenerator(generator, callback) {
	debug(".resetGenerator", generator);

	Async.series([
		done => {
			if (generator.paths && generator.paths.currentDirectory !== generator.paths.originalDirectory) {
				moveDirectory(generator.paths.currentDirectory, generator.paths.originalDirectory, error => {
					done(error);
				});
			} else {
				done();
			}
		},
		done => { unlinkDependencies(generator, done); }
	], callback);
}

function moveDirectory(fromPath, toPath, callback) {
	debug(".moveDirectory", fromPath, toPath);

	fileSystem.rename(fromPath, toPath, callback);
}

function isGlobalGenerator(generator) {
	debug(".isGlobalGenerator", generator);
	const isGlobal = generator.paths.realDirectory.indexOf(globalNodeModulesDirectory) !== -1;
	debugCallback("isGlobal", isGlobal);
	return isGlobal;
}

function linkDependencies(generator, callback) {
	debug(".linkDependencies", generator);

	Async.mapSeries(npmPackageNames, (npmPackageName, done) => {
		linkIfNotExisting(
			`${nodeModulesDirectoryPath}/${npmPackageName}`,
			`${generator.paths.nodeModulesDirectory}/${npmPackageName}`,
			error => {
				if (!error) {
					temporaryDependencyPaths.push(`${generator.paths.nodeModulesDirectory}/${npmPackageName}`);
					done();
				} else {
					done(error);
				}
			}
		);
	}, callback);
}

function unlinkDependencies(generator, callback) {
	debug(".unlinkDependencies", generator);

	Async.mapSeries(temporaryDependencyPaths, (temporaryDependencyPath, dependencyUnlinked) => {
		deleteFiles(temporaryDependencyPath, dependencyUnlinked);
	}, callback);
}

function generatorPackageName(generatorName) {
	debug(".generatorPackageName", generatorName);

	return `stimpak-${generatorName}`;
}

function linkIfNotExisting(fromPath, toPath, callback) {
	// debug(".linkIfNotExisting", fromPath, toPath);

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
				done();
			} else {
				symlink(fromPath, toPath, done);
			}
		}
	], callback);
}

function makeDirectory(directoryPath, callback) {
	debug(".makeDirectory", directoryPath);

	fileSystem.stat(directoryPath, error => {
		if (error) {
			fileSystem.mkdir(directoryPath, callback);
		} else {
			callback();
		}
	});
}

function resolveGeneratorPaths(generator, callback) {
	debug(".resolveGeneratorPaths", generator);

	Async.waterfall([
		done => { resolveGeneratorPath(generator, done); },
		(generatorPath, done) => {
			fileSystem.realpath(generatorPath, (error, realPath) => {
				generator.paths = {
					originalDirectory: generatorPath,
					nodeModulesDirectory: `${generatorPath}/node_modules`,
					temporaryDirectory: path.normalize(`${__dirname}/../../../generators/${generator.packageName}`),
					currentDirectory: generatorPath,
					realDirectory: realPath
				};
				debugCallback("paths", generator.paths);
				done(error);
			});
		}
	], callback);
}

function resolveGeneratorPath(generator, callback) {
	debug(".resolveGeneratorPath", generator);

	resolvePackagePath(generator, callback);
}

function resolvePackagePath(generator, callback) {
	debug(".resolvePackagePath", generator);

	Async.mapSeries(npmPaths(), (npmPath, done) => {
		const generatorFilePath = `${npmPath}/${generator.packageName}`;

		fileSystem.exists(generatorFilePath, fileExists => {
			if (fileExists) {
				done(null, generatorFilePath);
			} else {
				done(null);
			}
		});
	}, (existsError, paths) => {
		paths = paths.filter(foundPath => { return foundPath !== undefined; });

		debugCallback("paths", paths);

		if (!existsError) {
			const firstPathFound = paths[0];
			if (firstPathFound) {
				callback(null, firstPathFound);
			} else {
				const error = new Error(`"${generator.name}" is not installed. Use "npm install ${generator.packageName} -g"\n`);
				callback(error);
			}
		} else {
			callback(existsError);
		}
	});
}

function deleteFiles(filePath, callback) {
	//debug(".deleteFiles", filePath);

	if (filePath) {
		rimraf(filePath, error => {
			if (!error) {
				const index = temporaryDependencyPaths.indexOf(filePath);
				if (index !== -1) {
					temporaryDependencyPaths = temporaryDependencyPaths.splice(index, 1);
				}
				callback();
			} else {
				callback(error);
			}
		});
	} else {
		callback();
	}
}

function symlink(fromPath, toPath, callback) {
	//debug(".symlink", fromPath, toPath);
	fileSystem.symlink(fromPath, toPath, error => {
		if (!error) {
			temporaryDependencyPaths.push(toPath);
		}
		callback(error);
	});
}

/**
 * CLI UTILITY FUNCTIONS
 */

function parseArgv(argv) {
	debug(".parseArgv", argv);

	const parsedArgv = {
		first: argv[2],
		remaining: argv.splice(2),
		generatorNames: [],
		answers: {},
		debug: argv[2] === "--debug"

	};

	for (let argumentIndex in parsedArgv.remaining) {
		const argument = parsedArgv.remaining[argumentIndex];
		const isAnswer = argument.indexOf("--") !== -1;

		if (isAnswer) {
			const answerMatchData = /^--([^=]+)=(.*)$/.exec(argument);
			if (answerMatchData) {
				const answerName = answerMatchData[1];
				const answerValue = answerMatchData[2];
				parsedArgv.answers[answerName] = answerValue;
			} else {
				const errorMessage = `The provided answer "${argument}" is malformed, please use "--key=value".\n`;
				process.stderr.write(errorMessage);
			}
		} else {
			parsedArgv.generatorNames.push(argument);
		}
	}

	return parsedArgv;
}

/**
 * SHOW MESSAGES FUNCTIONS
 */

function showVersion(callback) {
	debug(".showVersion");

	process.stdout.write(`${packageJson.version}\n`);
	callback();
}

function showHelp(callback) {
	debug(".showHelp");

	fileSystem
		.createReadStream(`${__dirname}/templates/help.txt`)
		.pipe(process.stdout)
		.on("end", callback);
}

function showDone(callback) {
	debug(".showDone");

	fileSystem.readFile(`${__dirname}/templates/done.txt`, { encoding: "utf-8" }, (error, fileContents) => {
		process.stdout.write(fileContents);
		callback(error);
	});
}

/**
 * DEVELOPER FUNCTIONS
 */

function debug(message, ...extra) {
	if (showDebugInformation) {
		extra = extra.map(extraData => { return util.inspect(extraData) });
		console.log(`${colors.gray(message+"(")}${colors.yellow(extra.join(", "))}${colors.gray(")")}`);
	}
}

function debugCallback(message, ...extra) {
	if (showDebugInformation) {
		console.log(`  ${colors.red(message)}: `, colors.red(extra.join(", ")));
	}
}
