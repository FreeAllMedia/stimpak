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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Stimpak = require(__dirname + "/../stimpak/stimpak.js").default;

var StimpakCliRunner = function () {
	function StimpakCliRunner(argv) {
		_classCallCheck(this, StimpakCliRunner);

		var _ = (0, _incognito2.default)(this);
		_.tempFiles = [];
		_.movedFiles = {};
		_.rootDirectoryPath = _path2.default.normalize(__dirname + "/../../..");
		_.nodeModulesDirectoryPath = _.rootDirectoryPath + "/node_modules";

		this.routeCommand(argv);
	}

	_createClass(StimpakCliRunner, [{
		key: "routeCommand",
		value: function routeCommand(argv) {
			var firstArgument = argv[2];
			switch (firstArgument) {
				case "-V":
				case "--version":
					this.showVersion();
					break;
				case "-h":
				case "--help":
				case undefined:
					this.showHelp();
					break;

				default:
					this.runGenerators(argv);
			}
		}
	}, {
		key: "showVersion",
		value: function showVersion() {
			process.stdout.write(_package2.default.version + "\n");
		}
	}, {
		key: "showHelp",
		value: function showHelp() {
			_fsExtra2.default.createReadStream(__dirname + "/templates/help.txt").pipe(process.stdout);
		}
	}, {
		key: "runGenerators",
		value: function runGenerators(argv) {
			var stimpak = new Stimpak().destination(process.cwd());

			stimpak.answers(answers);

			process.on("exit", cleanup);

			var npmPackageNames = _glob2.default.sync("*", { cwd: nodeModulesDirectoryPath });

			var requirePaths = [];

			var _loop = function _loop(packageName) {
				var generatorPath = generatorPaths[packageName];
				var packagePath = generatorPath.path;
				var generatorName = generatorPath.generatorName;
				var packageNodeModulesDirectoryPath = packagePath + "/node_modules";

				if (packagePath) {
					npmPackageNames.forEach(function (npmPackageName) {
						linkDirectory(nodeModulesDirectoryPath + "/" + npmPackageName, packageNodeModulesDirectoryPath + "/" + npmPackageName);
					});

					makeDirectory(packageNodeModulesDirectoryPath);

					var packageDirectoryPath = nodeModulesDirectoryPath + "/" + packageName;

					var requirePath = packagePath;

					if (packagePath !== packageDirectoryPath) {
						moveFile(packagePath, packageDirectoryPath);
						requirePath = packageDirectoryPath;
					}

					requirePaths.push(requirePath);
				} else {
					var errorMessage = "\"" + generatorName + "\" is not installed. Use \"npm install " + packageName + " -g\"\n";
					process.stderr.write(errorMessage);
				}
			};

			for (var packageName in generatorPaths) {
				_loop(packageName);
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
			var ignoreTranspilingFilesGlob = rootDirectoryPath + "/**/@(node_modules)/stimpak-*/**/@(node_modules)/!(stimpak)*/**/*";
			require("babel-register")({
				ignore: ignoreTranspilingFilesGlob
			});

			var generatorConstructors = {};
			requirePaths.forEach(function (requirePath) {
				var GeneratorConstructor = generatorConstructors[requirePath];

				if (!GeneratorConstructor) {
					GeneratorConstructor = require(requirePath).default;
					generatorConstructors[requirePath] = GeneratorConstructor;
				}

				stimpak.use(GeneratorConstructor);
			});

			stimpak.generate(function (error) {
				if (error) {
					throw error;
				}
				var doneFileContents = _fsExtra2.default.readFileSync(__dirname + "/templates/done.txt", { encoding: "utf-8" });
				process.stdout.write(doneFileContents);
			});
		}
	}, {
		key: "parseArgv",
		value: function parseArgv(argv) {
			var lastArguments = argv.splice(2);

			var generatorNames = [];
			var answers = {};
			for (var argumentIndex in lastArguments) {
				var argument = lastArguments[argumentIndex];

				var hasAnswers = argument.indexOf("--") !== -1;

				if (hasAnswers) {
					var answerMatchData = /^--([^=]+)=(.*)$/.exec(argument);
					if (answerMatchData) {
						var answerName = answerMatchData[1];
						var answerValue = answerMatchData[2];
						answers[answerName] = answerValue;
					} else {
						var errorMessage = "The provided answer \"" + argument + "\" is malformed, please use \"--key=value\".\n";
						process.stderr.write(errorMessage);
					}
				} else {
					generatorNames.push(argument);
				}
			}

			var generatorPaths = {};
			var packagePaths = [];
			generatorNames.forEach(function (generatorName) {
				var packageName = "stimpak-" + generatorName;
				var packagePath = resolvePackagePath(packageName);

				packagePaths.push(packagePath);

				generatorPaths[packageName] = {
					generatorName: generatorName,
					path: packagePath
				};
			});
		}
	}, {
		key: "linkDirectory",
		value: function linkDirectory(fromPath, toPath) {
			if (_fsExtra2.default.existsSync(toPath)) {
				var fileStats = _fsExtra2.default.lstatSync(toPath);
				if (fileStats.isSymbolicLink()) {
					unlink(toPath);
					symlink(fromPath, toPath);
					_.tempFiles.push(toPath);
				}
			} else {
				symlink(fromPath, toPath);
			}
		}
	}, {
		key: "makeDirectory",
		value: function makeDirectory(directoryPath) {
			var stats = _fsExtra2.default.statSync(directoryPath);
			if (!stats.isDirectory()) {
				_fsExtra2.default.mkdirSync(directoryPath);
			}
		}
	}, {
		key: "moveFile",
		value: function moveFile(fromPath, toPath) {
			if (!_fsExtra2.default.existsSync(toPath)) {
				fromPath = _fsExtra2.default.realpathSync(fromPath);
				_fsExtra2.default.renameSync(fromPath, toPath);
				_.movedFiles[toPath] = fromPath;
			}
		}
	}, {
		key: "replaceFiles",
		value: function replaceFiles() {
			for (var toPath in _.movedFiles) {
				var fromPath = _.movedFiles[toPath];
				_fsExtra2.default.renameSync(toPath, fromPath);
			}
		}
	}, {
		key: "symlink",
		value: function symlink(fromPath, toPath) {
			_fsExtra2.default.symlinkSync(fromPath, toPath);
			addTempFile(toPath);
		}
	}, {
		key: "unlink",
		value: function unlink(filePath) {
			// HACK: Using rimraf.sync instead of fileSystem.unlinkSync because of weird behavior by unlinkSync. Rimraf is a slower solution, but it ensures that the file is completely removed before it moves on, unlinke unlinkSync: https://github.com/nodejs/node-v0.x-archive/issues/7164
			_rimraf2.default.sync(filePath);
			removeTempFile(filePath);
		}
	}, {
		key: "addTempFile",
		value: function addTempFile(filePath) {
			if (_.tempFiles.indexOf(filePath) === -1) {
				_.tempFiles.push(filePath);
			}
		}
	}, {
		key: "removeTempFile",
		value: function removeTempFile(filePath) {
			var index = _.tempFiles.indexOf(filePath);
			if (index > -1) {
				_.tempFiles = _.tempFiles.splice(index, 1);
			}
		}
	}, {
		key: "cleanup",
		value: function cleanup() {
			replaceFiles();
			cleanupTempFiles();
		}
	}, {
		key: "cleanupTempFiles",
		value: function cleanupTempFiles() {
			_.tempFiles.forEach(function (tempFile) {
				unlink(tempFile);
			});
		}
	}, {
		key: "resolvePackagePath",
		value: function resolvePackagePath(packageName) {
			var found = false;

			(0, _globalPaths2.default)().forEach(function (npmPath) {
				var generatorFilePath = npmPath + "/" + packageName;

				if (_fsExtra2.default.existsSync(generatorFilePath)) {
					found = generatorFilePath;
				}
			});

			return found;
		}
	}]);

	return StimpakCliRunner;
}();

exports.default = StimpakCliRunner;