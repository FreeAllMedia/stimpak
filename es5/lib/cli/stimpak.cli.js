#!/usr/bin/env node
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.run = run;

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _globalPaths = require("global-paths");

var _globalPaths2 = _interopRequireDefault(_globalPaths);

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _rimraf = require("rimraf");

var _rimraf2 = _interopRequireDefault(_rimraf);

var _flowsync = require("flowsync");

var _flowsync2 = _interopRequireDefault(_flowsync);

var _child_process = require("child_process");

var _colors = require("colors");

var _colors2 = _interopRequireDefault(_colors);

var _util = require("util");

var _util2 = _interopRequireDefault(_util);

var _package = require("../../../package.json");

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("babel-polyfill");

var parsedArguments = parseArgv(process.argv);

process.on("beforeExit", function () {
	/* eslint-disable no-process-exit */
	resetGenerators(function (error) {
		if (error) {
			throw error;
		}
		process.exit();
	});
});

/* -------------------------------------------------------------------------- */

/**
 * 3rd-Party Dependencies
 */


/**
 * Local Dependencies
 */

var Stimpak = require(__dirname + "/../stimpak/stimpak.js").default;

/**
 * Constants
 */

var stimpak = new Stimpak().destination(process.cwd()).answers(parsedArguments.answers);

/**
 * Variables
 */
var generators = {},
    temporaryDependencyPaths = [],
    globalNodeModulesDirectory = void 0,
    rootDirectoryPath = _path2.default.normalize(__dirname + "/../../.."),
    nodeModulesDirectoryPath = rootDirectoryPath + "/node_modules",
    npmPackageNames = _glob2.default.sync("*", { cwd: nodeModulesDirectoryPath });

/** ------------------------------------------------------------------------ **/

enableDebug();
run(function (error) {
	if (error) {
		resetGenerators(function (resetError) {
			if (error) {
				throw error;
			}
			if (resetError) {
				throw resetError;
			}
		});
	}
});

/** ------------------------------------------------------------------------ **/

function run(callback) {
	debug(".run");

	_flowsync2.default.series([function (done) {
		determineGlobalNodeModulesDirectory(done);
	}, function (done) {
		routeCommand(done);
	}], callback);
}

function enableDebug() {
	if (parsedArguments.debug) {
		stimpak.debugStream(process.stdout);
		process.stdout.write("STIMPAK DEBUG MODE\n");
	}
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
			runGenerators(function (error) {
				if (!error) {
					showDone(callback);
				} else {
					callback(error);
				}
			});
	}
}

function enableJustInTimeTranspiling() {
	require("babel-register")({
		ignore: ["**/node_modules/!(stimpak)*/**/*.*", rootDirectoryPath + "/node_modules/**/*"]
	});
}

function determineGlobalNodeModulesDirectory(callback) {
	debug(".determineGlobalNodeModulesDirectory");

	(0, _child_process.exec)("npm config get prefix", function (error, stdout) {
		globalNodeModulesDirectory = stdout.toString().replace(/[\n\r]/, "/lib/node_modules");

		debugCallback("globalNodeModulesDirectory", globalNodeModulesDirectory);

		callback();
	});
}

function runGenerators(callback) {
	debug(".runGenerators");

	_flowsync2.default.series([function (done) {
		loadGenerators(parsedArguments.generatorNames, done);
	}, function (done) {
		generateFiles(done);
	}, function (done) {
		showReport(done);
	}], callback);
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

	_flowsync2.default.mapSeries(generatorNames, loadGenerator.bind(this), callback);
}

function loadGenerator(generatorName, callback) {
	debug(".loadGenerator", generatorName);

	var generator = generators[generatorName] = {
		name: generatorName,
		packageName: generatorPackageName(generatorName)
	};

	_flowsync2.default.series([function (done) {
		resolveGeneratorPaths(generator, done);
	}, function (done) {
		makeNodeModuleDirectories(generator, done);
	}, function (done) {
		linkDependencies(generator, done);
	}, function (done) {
		linkOrMoveIfGlobalGenerator(generator, done);
	}, function (done) {
		requireGenerator(generator, done);
	}], callback);
}

function makeNodeModuleDirectories(generator, callback) {
	_flowsync2.default.mapSeries(generator.paths.nodeModulesDirectories, makeDirectory, callback);
}

function linkOrMoveIfGlobalGenerator(generator, callback) {
	debug(".linkOrMoveIfGlobalGenerator", generator);

	var originalDirectory = generator.paths.originalDirectory;
	var temporaryDirectory = generator.paths.temporaryDirectory;

	if (isGlobalGenerator(generator)) {
		moveDirectory(originalDirectory, temporaryDirectory, function (error) {
			generator.paths.currentDirectory = temporaryDirectory;
			callback(error);
		});
	} else {
		forceSymlink(originalDirectory, temporaryDirectory, callback);
	}
}

function forceSymlink(fromPath, toPath, callback) {
	_fsExtra2.default.exists(toPath, function (exists) {
		if (!exists) {
			symlink(fromPath, toPath, function (error) {
				callback(error);
			});
		} else {
			_flowsync2.default.series([function (done) {
				deleteFiles(toPath, done);
			}, function (done) {
				symlink(fromPath, toPath, function (error) {
					done(error);
				});
			}], callback);
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

	_flowsync2.default.mapSeries(Object.keys(generators), function (generatorName, done) {
		var generator = generators[generatorName];
		resetGenerator(generator, done);
	}, function (error) {
		if (callback) {
			callback(error);
		}
	});
}

function resetGenerator(generator, callback) {
	debug(".resetGenerator", generator);

	_flowsync2.default.series([function (done) {
		if (generator.paths && generator.paths.currentDirectory !== generator.paths.originalDirectory) {
			moveDirectory(generator.paths.currentDirectory, generator.paths.originalDirectory, function (error) {
				done(error);
			});
		} else {
			done();
		}
	}, function (done) {
		unlinkDependencies(generator, done);
	}], callback);
}

function moveDirectory(fromPath, toPath, callback) {
	debug(".moveDirectory", fromPath, toPath);

	_fsExtra2.default.rename(fromPath, toPath, callback);
}

function isGlobalGenerator(generator) {
	debug(".isGlobalGenerator", generator);
	var isGlobal = generator.paths.realDirectory.indexOf(globalNodeModulesDirectory) !== -1;
	debugCallback("isGlobal", isGlobal);
	return isGlobal;
}

function linkDependencies(generator, callback) {
	debug(".linkDependencies", generator.paths.nodeModulesDirectories);
	_flowsync2.default.mapSeries(generator.paths.nodeModulesDirectories, linkTranspilingDependencies, callback);
}

function linkTranspilingDependencies(generatorNodeModulesDirectoryPath, callback) {
	debug(".linkTranspilingDependencies", generatorNodeModulesDirectoryPath);
	_flowsync2.default.mapSeries(npmPackageNames, function (npmPackageName, done) {
		// debugCallback("npmPackageName", npmPackageName);
		linkIfNotExisting(nodeModulesDirectoryPath + "/" + npmPackageName, generatorNodeModulesDirectoryPath + "/" + npmPackageName, function (error) {
			// debugCallback("dependencies linked");
			if (!error) {
				done();
			} else {
				done(error);
			}
		});
	}, callback);
}

function unlinkDependencies(generator, callback) {
	debug(".unlinkDependencies", generator);

	_flowsync2.default.mapSeries(temporaryDependencyPaths, function (temporaryDependencyPath, dependencyUnlinked) {
		deleteFiles(temporaryDependencyPath, dependencyUnlinked);
	}, callback);
}

function generatorPackageName(generatorName) {
	debug(".generatorPackageName", generatorName);

	return "stimpak-" + generatorName;
}

function linkIfNotExisting(fromPath, toPath, callback) {
	//debug(".linkIfNotExisting", fromPath, toPath);

	temporaryDependencyPaths.push(toPath);

	_flowsync2.default.waterfall([function (done) {
		_fsExtra2.default.lstat(toPath, function (error, stats) {
			if (error) {
				done(null, null);
			} else {
				done(null, stats);
			}
		});
	}, function (link, done) {
		if (link) {
			done();
		} else {
			//debugCallback("dependency linked", toPath);
			symlink(fromPath, toPath, done);
		}
	}], function (error) {
		//debugCallback("link if not existing done");
		callback(error);
	});
}

function makeDirectory(directoryPath, callback) {
	debug(".makeDirectory", directoryPath);

	_fsExtra2.default.stat(directoryPath, function (error) {
		if (error) {
			_fsExtra2.default.mkdir(directoryPath, function (makeDirectoryError) {
				debugCallback("directory made", directoryPath);
				callback(makeDirectoryError);
			});
		} else {
			callback();
		}
	});
}

function resolveGeneratorPaths(generator, callback) {
	debug(".resolveGeneratorPaths", generator);

	_flowsync2.default.waterfall([function (done) {
		resolveGeneratorPath(generator, function (error, generatorPath) {
			debugCallback("resolve generator path", generatorPath);
			done(error, generatorPath);
		});
	}, function (generatorPath, done) {
		debugCallback("path resolved", generatorPath);
		_fsExtra2.default.realpath(generatorPath, function (error, realPath) {
			debugCallback("real path resolved", realPath);
			var stimpakDirectories = _glob2.default.sync(realPath + "{/,/**/stimpak-*/}", { follow: true });
			debugCallback("stimpak directories", stimpakDirectories);
			generator.paths = {
				originalDirectory: generatorPath,
				temporaryDirectory: rootDirectoryPath + "/generators/" + generator.packageName,
				currentDirectory: generatorPath,
				realDirectory: realPath,
				stimpakDirectories: stimpakDirectories
			};

			generator.paths.nodeModulesDirectories = generator.paths.stimpakDirectories.map(function (stimpakDirectoryPath) {
				return stimpakDirectoryPath + "node_modules";
			});

			done(error);
		});
	}], function (error) {
		debugCallback("resolve generator paths done");
		callback(error);
	});
}

function resolveGeneratorPath(generator, callback) {
	debug(".resolveGeneratorPath", generator);

	resolvePackagePath(generator, callback);
}

function resolvePackagePath(generator, callback) {
	debug(".resolvePackagePath", generator);

	_flowsync2.default.mapSeries((0, _globalPaths2.default)(), checkGeneratorPath(generator), returnGeneratorPath(generator, function (error, packagePath) {
		debugCallback("returned generator path", packagePath);
		callback(error, packagePath);
	}));
}

function returnGeneratorPath(generator, callback) {
	return function (error, paths) {
		debug(".returnGeneratorPath");
		paths = paths.filter(function (foundPath) {
			return foundPath !== undefined;
		});

		if (!error) {
			var firstPathFound = paths[0];
			debugCallback("firstPathFound", firstPathFound);
			if (firstPathFound) {
				callback(null, firstPathFound);
			} else {
				var generatorNotFoundError = new Error("\"" + generator.name + "\" is not installed. Use \"npm install " + generator.packageName + " -g\"\n");
				callback(generatorNotFoundError);
			}
		} else {
			callback(error);
		}
	};
}

function checkGeneratorPath(generator) {
	return function (npmPath, done) {
		debug(".checkGeneratorPath", npmPath);
		var generatorFilePath = npmPath + "/" + generator.packageName;
		_fsExtra2.default.exists(generatorFilePath, function (fileExists) {
			debugCallback("fileExists", generatorFilePath, fileExists);
			if (fileExists) {
				done(null, generatorFilePath);
			} else {
				done(null);
			}
		});
	};
}

function deleteFiles(filePath, callback) {
	//debug(".deleteFiles", filePath);

	if (filePath) {
		(0, _rimraf2.default)(filePath, function (error) {
			if (!error) {
				var index = temporaryDependencyPaths.indexOf(filePath);
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
	_fsExtra2.default.symlink(fromPath, toPath, function (error) {
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
	//let parsedArgs = argv;
	var debugIndex = argv.indexOf("--debug");
	var useDebug = debugIndex !== -1;

	//if (useDebug) { delete parsedArgs[debugIndex]; }

	var parsedArgv = {
		first: argv[2],
		remaining: argv.splice(2),
		generatorNames: [],
		answers: {},
		debug: useDebug
	};

	for (var argumentIndex in parsedArgv.remaining) {
		var argument = parsedArgv.remaining[argumentIndex];
		var isAnswer = argument.indexOf("--") !== -1;

		if (isAnswer) {
			var answerMatchData = /^--([^=]+)=(.*)$/.exec(argument);
			if (answerMatchData) {
				var answerName = answerMatchData[1];
				var answerValue = answerMatchData[2];
				parsedArgv.answers[answerName] = answerValue;
			} else {
				var errorMessage = "The provided answer \"" + argument + "\" is malformed, please use \"--key=value\".\n";
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

	process.stdout.write(_package2.default.version + "\n");
	callback();
}

function showHelp(callback) {
	debug(".showHelp");

	_fsExtra2.default.createReadStream(__dirname + "/templates/help.txt").pipe(process.stdout).on("end", callback);
}

function showDone(callback) {
	debug(".showDone");

	_fsExtra2.default.readFile(__dirname + "/templates/done.txt", { encoding: "utf-8" }, function (error, fileContents) {
		process.stdout.write("\n" + fileContents);
		callback(error);
	});
}

function showReport(callback) {
	for (var file in stimpak.report.files) {
		var color = void 0;

		if (file.isMerged) {
			color = _colors2.default.yellow();
		} else {
			color = _colors2.default.red();
		}

		process.stdout.write(color(file.path) + "\n");
	}
	callback();
}

/**
 * DEVELOPER FUNCTIONS
 */

var startTime = new Date(),
    endTime = void 0;

function debug(message) {
	for (var _len = arguments.length, extra = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		extra[_key - 1] = arguments[_key];
	}

	if (parsedArguments.debug) {
		startTime = new Date();
		extra = extra.map(function (extraData) {
			return _util2.default.inspect(extraData);
		});
		console.log("" + _colors2.default.gray(message + "(") + _colors2.default.yellow(extra.join(", ")) + _colors2.default.gray(")"));
	}
}

function debugCallback(message) {
	if (parsedArguments.debug) {
		endTime = new Date();
		var secondsElapsed = (endTime - startTime) / 1000;

		for (var _len2 = arguments.length, extra = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
			extra[_key2 - 1] = arguments[_key2];
		}

		console.log("  " + _colors2.default.red(message) + ": ", _colors2.default.red(extra.join(", ")) + _colors2.default.gray(" [" + secondsElapsed + "]"));
	}
}