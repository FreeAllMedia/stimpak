"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _package = require("../../../package.json");

var _package2 = _interopRequireDefault(_package);

var _globalPaths = require("global-paths");

var _globalPaths2 = _interopRequireDefault(_globalPaths);

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _rimraf = require("rimraf");

var _rimraf2 = _interopRequireDefault(_rimraf);

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var _flowsync = require("flowsync");

var _flowsync2 = _interopRequireDefault(_flowsync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Stimpak = require(__dirname + "/../stimpak/stimpak.js").default;

var tempFiles = [],
    movedFiles = {};

function cleanup() {
	cleanupTempFiles(function () {
		moveFilesBack(function () {
			// Process exits here
		});
	});
}

function moveFilesBack(callback) {
	_flowsync2.default.mapSeries(Object.keys(movedFiles), function (toPath, done) {
		var fromPath = movedFiles[toPath];
		_fsExtra2.default.rename(toPath, fromPath, function () {
			delete movedFiles[toPath];
			done();
		});
	}, callback);
}

function cleanupTempFiles(callback) {
	_flowsync2.default.mapSeries(tempFiles, function (tempFile, done) {
		deleteFiles(tempFile, done);
	}, callback);
}

function deleteFiles(filePath, callback) {
	if (filePath) {
		(0, _rimraf2.default)(filePath, function (error) {
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
	var index = tempFiles.indexOf(filePath);
	if (index > -1) {
		tempFiles = tempFiles.splice(index, 1);
	}
}

process.on("exit", cleanup);

var StimpakCliRunner = function () {
	function StimpakCliRunner() {
		_classCallCheck(this, StimpakCliRunner);

		var _ = (0, _incognito2.default)(this);
		_.generatorConstructors = {};
		_.rootDirectoryPath = _path2.default.normalize(__dirname + "/../../..");
		_.nodeModulesDirectoryPath = _.rootDirectoryPath + "/node_modules";
		_.npmPackageNames = _glob2.default.sync("*", { cwd: _.nodeModulesDirectoryPath });
	}

	_createClass(StimpakCliRunner, [{
		key: "run",
		value: function run(argv, callback) {
			this.routeCommand(argv, callback);
		}
	}, {
		key: "routeCommand",
		value: function routeCommand(argv, callback) {
			var _this = this;

			var parsedArguments = this.parseArgv(argv);
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
					this.runGenerators(parsedArguments.generatorNames, parsedArguments.answers, function (error) {
						if (!error) {
							_this.showDone(callback);
						} else {
							callback(error);
						}
					});
			}
		}
	}, {
		key: "initializeStimpak",
		value: function initializeStimpak(answers) {
			var _ = (0, _incognito2.default)(this);
			_.stimpak = new Stimpak().destination(process.cwd()).answers(answers);
		}
	}, {
		key: "runGenerators",
		value: function runGenerators(generatorNames, answers, callback) {
			var _this2 = this;

			this.enableJustInTimeTranspiling();
			this.initializeStimpak(answers);

			var _ = (0, _incognito2.default)(this);

			_flowsync2.default.series([function (done) {
				_this2.loadGenerators(generatorNames, done);
			}, function (done) {
				_.stimpak.generate(done);
			}], callback);
		}
	}, {
		key: "enableJustInTimeTranspiling",
		value: function enableJustInTimeTranspiling() {
			/*
   	Explanation of this monster glob (from right to left):
   		* Get all files in all directories
   		* Inside of directories that don't have "stimpak" in their name
   		* Inside of a node_modules directory
   		* Anywhere inside of a directory that begins with "stimpak-"
   		* Inside of a node_modules directory
   		* Anywhere inside of the root directory
   */
			var rootDirectoryPath = (0, _incognito2.default)(this).rootDirectoryPath;
			var ignoreTranspilingFilesGlob = rootDirectoryPath + "/**/@(node_modules)/stimpak-*/**/@(node_modules)/!(stimpak)*/**/*";
			require("babel-register")({
				ignore: ignoreTranspilingFilesGlob
			});
		}
	}, {
		key: "loadGenerators",
		value: function loadGenerators(generatorNames, callback) {
			_flowsync2.default.mapSeries(generatorNames, this.loadGenerator.bind(this), callback);
		}
	}, {
		key: "loadGenerator",
		value: function loadGenerator(generatorName, callback) {
			var _this3 = this;

			_flowsync2.default.waterfall([function (done) {
				_this3.resolveGeneratorPath(generatorName, done);
			}, function (generatorPath, done) {
				_this3.setupGenerator(generatorName, generatorPath, function (error) {
					done(error, generatorPath);
				});
			}, function (generatorPath, done) {
				_this3.useGenerator(generatorName, generatorPath, done);
			}], callback);
		}
	}, {
		key: "setupGenerator",
		value: function setupGenerator(generatorName, generatorPath, callback) {
			var _this4 = this;

			var packageNodeModulesDirectoryPath = generatorPath + "/node_modules";
			_flowsync2.default.series([function (done) {
				_this4.makeDirectory(packageNodeModulesDirectoryPath, done);
			}, function (done) {
				_this4.linkDependencies(packageNodeModulesDirectoryPath, done);
			}], callback);
		}
	}, {
		key: "linkDependencies",
		value: function linkDependencies(packageDirectoryPath, callback) {
			var _this5 = this;

			var _ = (0, _incognito2.default)(this);
			var nodeModulesDirectoryPath = _.nodeModulesDirectoryPath;
			var npmPackageNames = _.npmPackageNames;
			_flowsync2.default.mapSeries(npmPackageNames, function (npmPackageName, directoryLinked) {
				_this5.linkDirectory(nodeModulesDirectoryPath + "/" + npmPackageName, packageDirectoryPath + "/" + npmPackageName, directoryLinked);
			}, callback);
		}
	}, {
		key: "packageDirectoryPath",
		value: function packageDirectoryPath(generatorName) {
			var _ = (0, _incognito2.default)(this);
			var packageName = this.generatorPackageName(generatorName);
			return _.nodeModulesDirectoryPath + "/" + packageName;
		}
	}, {
		key: "useGenerator",
		value: function useGenerator(generatorName, generatorPath, callback) {
			var _this6 = this;

			var _ = (0, _incognito2.default)(this);

			var generatorConstructors = _.generatorConstructors;
			var stimpak = _.stimpak;

			var packageDirectoryPath = this.packageDirectoryPath(generatorName);
			_flowsync2.default.series([function (done) {
				if (generatorPath !== packageDirectoryPath) {
					_this6.moveFiles(generatorPath, packageDirectoryPath, done);
				} else {
					done();
				}
			}, function (done) {
				var GeneratorConstructor = generatorConstructors[packageDirectoryPath];

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
			}, function (done) {
				cleanupTempFiles(function () {
					moveFilesBack(done);
				});
			}], callback);
		}

		/**
   * UTILITY METHODS
   * TODO: Split these out into individual files
   */

	}, {
		key: "linkDirectory",
		value: function linkDirectory(fromPath, toPath, callback) {
			var _this7 = this;

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
					if (link.isSymbolicLink()) {
						deleteFiles(toPath, done);
					} else {
						done();
					}
				} else {
					done();
				}
			}, function (done) {
				_this7.symlink(fromPath, toPath, done);
			}], callback);
		}
	}, {
		key: "makeDirectory",
		value: function makeDirectory(directoryPath, callback) {
			_fsExtra2.default.stat(directoryPath, function (error, stats) {
				if (!error) {
					if (!stats.isDirectory()) {
						_fsExtra2.default.mkdir(directoryPath, callback);
					} else {
						callback();
					}
				} else {
					callback(error);
				}
			});
		}
	}, {
		key: "moveFiles",
		value: function moveFiles(fromPath, toPath, callback) {
			_fsExtra2.default.exists(toPath, function (fileExists) {
				if (!fileExists) {
					_flowsync2.default.waterfall([function (done) {
						_fsExtra2.default.realpath(fromPath, done);
					}, function (realPath, done) {
						_fsExtra2.default.rename(realPath, toPath, function (error) {
							done(error, realPath);
							movedFiles[toPath] = realPath;
						});
					}], callback);
				} else {
					callback();
				}
			});
		}
	}, {
		key: "showVersion",
		value: function showVersion(callback) {
			process.stdout.write(_package2.default.version + "\n");
			callback();
		}
	}, {
		key: "showHelp",
		value: function showHelp(callback) {
			_fsExtra2.default.createReadStream(__dirname + "/templates/help.txt").pipe(process.stdout);
			callback();
		}
	}, {
		key: "showDone",
		value: function showDone(callback) {
			_fsExtra2.default.readFile(__dirname + "/templates/done.txt", { encoding: "utf-8" }, function (error, fileContents) {
				process.stdout.write(fileContents);
				callback(error);
			});
		}
	}, {
		key: "parseArgv",
		value: function parseArgv(argv) {
			var parsedArguments = {
				first: argv[2],
				remaining: argv.splice(2),
				generatorNames: [],
				answers: {}
			};

			for (var argumentIndex in parsedArguments.remaining) {
				var argument = parsedArguments.remaining[argumentIndex];
				var isAnswer = argument.indexOf("--") !== -1;

				if (isAnswer) {
					var answerMatchData = /^--([^=]+)=(.*)$/.exec(argument);
					if (answerMatchData) {
						var answerName = answerMatchData[1];
						var answerValue = answerMatchData[2];
						parsedArguments.answers[answerName] = answerValue;
					} else {
						var errorMessage = "The provided answer \"" + argument + "\" is malformed, please use \"--key=value\".\n";
						process.stderr.write(errorMessage);
					}
				} else {
					parsedArguments.generatorNames.push(argument);
				}
			}

			return parsedArguments;
		}
	}, {
		key: "generatorPackageName",
		value: function generatorPackageName(generatorName) {
			return "stimpak-" + generatorName;
		}
	}, {
		key: "resolveGeneratorPath",
		value: function resolveGeneratorPath(generatorName, callback) {
			var packageName = this.generatorPackageName(generatorName);
			this.resolvePackagePath(generatorName, packageName, callback);
		}
	}, {
		key: "resolvePackagePath",
		value: function resolvePackagePath(generatorName, packageName, callback) {

			_flowsync2.default.mapSeries((0, _globalPaths2.default)(), function (npmPath, done) {

				var generatorFilePath = npmPath + "/" + packageName;
				_fsExtra2.default.exists(generatorFilePath, function (fileExists) {

					if (fileExists) {

						done(null, generatorFilePath);
					} else {

						done(null);
					}
				});
			}, function (existsError, paths) {
				paths = paths.filter(function (foundPath) {
					return foundPath !== undefined;
				});

				if (!existsError) {

					var firstPathFound = paths[0];
					if (firstPathFound) {

						callback(null, firstPathFound);
					} else {

						var error = new Error("\"" + generatorName + "\" is not installed. Use \"npm install " + packageName + " -g\"\n");
						callback(error);
					}
				} else {

					callback(existsError);
				}
			});
		}
	}, {
		key: "symlink",
		value: function symlink(fromPath, toPath, callback) {
			_fsExtra2.default.symlink(fromPath, toPath, function (error) {
				addTempFile(toPath);
				callback(error);
			});
		}
	}]);

	return StimpakCliRunner;
}();

exports.default = StimpakCliRunner;