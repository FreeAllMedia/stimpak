"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = jobsToFileMixers;

var _async = require("async");

var _async2 = _interopRequireDefault(_async);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _filemixer = require("filemixer");

var _filemixer2 = _interopRequireDefault(_filemixer);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _isJson = require("is-json");

var _isJson2 = _interopRequireDefault(_isJson);

var _mergeJSON = require("../mergers/mergeJSON.js");

var _mergeJSON2 = _interopRequireDefault(_mergeJSON);

var _mergeText = require("../mergers/mergeText.js");

var _mergeText2 = _interopRequireDefault(_mergeText);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function jobsToFileMixers(stimpak, jobs, done) {
	_async2.default.mapSeries(jobs, _async2.default.apply(jobToFileMixer, stimpak), done);
}

function jobToFileMixer(stimpak, job, readDone) {
	var name = job.name;

	var destinationBase = stimpak.destination() + "/";
	var destinationPath = "" + destinationBase + name;

	var templatePath = job.templatePath;

	var steps = [];

	if (templatePath) {
		steps = steps.concat([function (done) {
			_fs2.default.stat(templatePath, function (error, stats) {
				done(null, stats);
			});
		}, function (stats, done) {
			if (stats.isFile()) {
				_fs2.default.readFile(templatePath, { encoding: "utf8" }, done);
			} else {
				done(null, null);
			}
		}]);
	} else {
		var pathIsAbsolute = _path2.default.resolve(job.path) === _path2.default.normalize(job.path);

		if (pathIsAbsolute) {
			destinationPath = job.path;
			destinationBase = _path2.default.dirname(job.path) + "/";
		} else {
			destinationPath = "" + destinationBase + job.path;
		}

		steps.push(function (done) {
			return done(null, job.contents);
		});
	}

	steps.push(function (contents, done) {
		var fileMixerOptions = {
			path: destinationPath,
			contents: contents,
			base: destinationBase
		};

		var fileMixer = new _filemixer2.default(fileMixerOptions);

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
	});

	_async2.default.waterfall(steps, readDone);
}