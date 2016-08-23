"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = render;

var _filemixer = require("filemixer");

var _filemixer2 = _interopRequireDefault(_filemixer);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _async = require("async");

var _async2 = _interopRequireDefault(_async);

var _minimatch = require("minimatch");

var _minimatch2 = _interopRequireDefault(_minimatch);

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var _sortByPathLength = require("../sorters/sortByPathLength.js");

var _sortByPathLength2 = _interopRequireDefault(_sortByPathLength);

var _globToFileNames = require("../steps/globToFileNames.js");

var _globToFileNames2 = _interopRequireDefault(_globToFileNames);

var _isJson = require("is-json");

var _isJson2 = _interopRequireDefault(_isJson);

var _mergeJSON = require("../mergers/mergeJSON.js");

var _mergeJSON2 = _interopRequireDefault(_mergeJSON);

var _mergeText = require("../mergers/mergeText.js");

var _mergeText2 = _interopRequireDefault(_mergeText);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function render(globString, directoryPath) {
	this.then(function (stimpak, thenDone) {
		var steps = [_async2.default.apply(_globToFileNames2.default, globString, directoryPath), _async2.default.apply(fileNamesToJobs, globString, directoryPath), _async2.default.apply(removeSkippedJobs, stimpak), _async2.default.apply(renderJobPaths, stimpak), _async2.default.apply(removeSkippedJobs, stimpak), _async2.default.apply(addMergeStrategiesToJobs, stimpak), _async2.default.apply(jobsToFileMixers, stimpak), sortFileMixersByPathLength, _async2.default.apply(writeFileMixers, stimpak), _async2.default.apply(reportEventsAndFiles, stimpak)];

		_async2.default.waterfall(steps, thenDone);
	});
	return this;
}

// Steps below here
//
// TODO: Break these out into other files

function reportEventsAndFiles(stimpak, files, done) {

	done();
}

function writeFileMixers(stimpak, fileMixers, done) {
	_async2.default.mapSeries(fileMixers, _async2.default.apply(writeFileMixer, stimpak), done);
}

function writeFileMixer(stimpak, fileMixer, done) {
	var report = (0, _incognito2.default)(stimpak).report;

	fileMixer.write(function (error, file) {
		var event = void 0;
		if (!error) {
			if (!file.isMerged) {
				if (file.isFile) {
					event = {
						type: "writeFile",
						templatePath: fileMixer.templatePath,
						path: file.path,
						contents: file.contents
					};
				} else {
					event = {
						type: "writeDirectory",
						templatePath: fileMixer.templatePath,
						path: file.path
					};

					delete file.contents;
				}

				file.templatePath = fileMixer.templatePath;

				report.events.push(event);
				report.files[file.path] = file;
			} else {
				report.events.push({
					contents: file.contents,
					oldContents: fileMixer.originalContents,
					oldPath: fileMixer.originalPath,
					path: file.path,
					templatePath: fileMixer.templatePath,
					type: "mergeFile"
				});

				var reportFileObject = Object.assign({
					templatePath: fileMixer.templatePath,
					oldContents: fileMixer.originalContents,
					oldPath: fileMixer.originalPath
				}, file);

				stimpak.report.files[file.path] = reportFileObject;
			}
			done(null, file);
		} else {
			error.message = error.message.replace(/(.*) is not defined/, "\"$1\" is not defined in \"" + fileMixer.templatePath + "\"");
			done(error);
		}
	});
}

function sortFileMixersByPathLength(fileMixers, done) {
	var sortedFileMixers = fileMixers.sort(_sortByPathLength2.default);
	done(null, sortedFileMixers);
}

function jobsToFileMixers(stimpak, jobs, done) {
	_async2.default.mapSeries(jobs, _async2.default.apply(jobToFileMixer, stimpak), done);
}

function fileNamesToJobs(globString, directoryPath, fileNames, done) {
	var jobs = fileNames.map(function (fileName) {
		var base = directoryPath + "/";
		var job = {
			glob: globString,
			base: base,
			name: fileName,
			templateName: fileName,
			templatePath: base + fileName
		};
		return job;
	});

	done(null, jobs);
}

function renderJobPaths(stimpak, jobs, done) {
	jobs.forEach(function (job) {
		job.name = renderPlaceholders(stimpak, job.name);
	});

	done(null, jobs);
}

function addMergeStrategiesToJobs(stimpak, jobs, callback) {
	jobs.forEach(function (job) {
		var fileName = job.name;
		var mergeStrategies = stimpak.merge();

		var matchedStrategies = [];

		mergeStrategies.forEach(function (mergeStrategy) {
			var globString = mergeStrategy[0];
			var shouldMerge = (0, _minimatch2.default)(fileName, globString);

			if (shouldMerge) {
				matchedStrategies.push(mergeStrategy);
			}
		});

		job.mergeStrategies = matchedStrategies;
	});

	callback(null, jobs);
}

function jobToFileMixer(stimpak, job, readDone) {
	var name = job.name;
	var templatePath = job.templatePath;
	var destinationBase = stimpak.destination() + "/";
	var destinationPath = destinationBase + name;

	_async2.default.waterfall([function (done) {
		_fs2.default.stat(templatePath, function (error, stats) {
			done(null, stats);
		});
	}, function (stats, done) {
		if (stats.isFile()) {
			_fs2.default.readFile(templatePath, { encoding: "utf8" }, done);
		} else {
			done(null, null);
		}
	}, function (contents, done) {
		var fileMixer = new _filemixer2.default({
			path: destinationPath,
			contents: contents,
			base: destinationBase
		});

		if (job.mergeStrategies.length > 0) {
			var mergeWithAllStrategies = function mergeWithAllStrategies(self, oldFile, newFile, mergeDone) {
				var currentFile = newFile;
				_async2.default.mapSeries(job.mergeStrategies, function (mergeStrategy, mergeStrategyDone) {
					var mergeFunction = mergeStrategy[1];

					if (!mergeFunction) {
						if ((0, _isJson2.default)(oldFile.contents.toString()) && (0, _isJson2.default)(newFile.contents).toString()) {
							mergeFunction = _mergeJSON2.default;
						} else {
							mergeFunction = _mergeText2.default;
						}
					}

					fileMixer.originalContents = oldFile.contents;
					fileMixer.originalPath = oldFile.path;

					mergeFunction(stimpak, oldFile, currentFile, function (error, mergedFile) {
						if (!error) {
							mergedFile.isMerged = true;
							currentFile = mergedFile;
						}
						mergeStrategyDone(error);
					});
				}, function (error) {
					if (!error) {
						var mergedFile = currentFile;
						mergeDone(null, mergedFile);
					} else {
						mergeDone(error);
					}
				});
			};

			fileMixer.merge(mergeWithAllStrategies);
		}

		fileMixer.values(stimpak.answers());
		fileMixer.templatePath = templatePath;

		done(null, fileMixer);
	}], readDone);
}

function removeSkippedJobs(stimpak, jobs, done) {
	var filteredJobs = jobs.filter(function (job) {
		return shouldRenderJob(stimpak, job);
	});
	done(null, filteredJobs);
}

function shouldRenderJob(stimpak, job) {
	var skipStrings = stimpak.skip();

	skipStrings = skipStrings.concat.apply([], skipStrings);

	var shouldRender = true;

	skipStrings.forEach(function (skipString) {
		var name = job.name;

		var templatePath = job.base + "/" + job.name;
		var destinationPath = stimpak.destination() + "/" + job.name;

		var minimatchOptions = { dot: true };

		var templatePathMatched = (0, _minimatch2.default)(templatePath, skipString, minimatchOptions);
		var destinationPathMatched = (0, _minimatch2.default)(destinationPath, skipString, minimatchOptions);
		var nameMatched = (0, _minimatch2.default)(name, skipString, minimatchOptions);

		if (nameMatched || templatePathMatched || destinationPathMatched) {
			shouldRender = false;
		}
	});

	return shouldRender;
}

function renderPlaceholders(stimpak, path) {
	var answers = stimpak.answers();

	for (var key in answers) {
		var answer = answers[key];
		path = path.replace(new RegExp("##" + key + "##", "g"), answer);
	}

	return path;
}