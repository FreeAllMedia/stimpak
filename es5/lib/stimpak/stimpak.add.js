"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = add;

var _async = require("async");

var _async2 = _interopRequireDefault(_async);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _globToFileNames = require("../steps/globToFileNames.js");

var _globToFileNames2 = _interopRequireDefault(_globToFileNames);

var _fileNamesToJobs = require("../steps/fileNamesToJobs.js");

var _fileNamesToJobs2 = _interopRequireDefault(_fileNamesToJobs);

var _addMergeStrategiesToJobs = require("../steps/addMergeStrategiesToJobs.js");

var _addMergeStrategiesToJobs2 = _interopRequireDefault(_addMergeStrategiesToJobs);

var _writeFileMixers = require("../steps/writeFileMixers.js");

var _writeFileMixers2 = _interopRequireDefault(_writeFileMixers);

var _sortFileMixersByPathLength = require("../steps/sortFileMixersByPathLength.js");

var _sortFileMixersByPathLength2 = _interopRequireDefault(_sortFileMixersByPathLength);

var _jobsToFileMixers = require("../steps/jobsToFileMixers.js");

var _jobsToFileMixers2 = _interopRequireDefault(_jobsToFileMixers);

var _renderJobPaths = require("../steps/renderJobPaths.js");

var _renderJobPaths2 = _interopRequireDefault(_renderJobPaths);

var _removeSkippedJobs = require("../steps/removeSkippedJobs.js");

var _removeSkippedJobs2 = _interopRequireDefault(_removeSkippedJobs);

var _virtualFileToJob = require("../steps/virtualFileToJob.js");

var _virtualFileToJob2 = _interopRequireDefault(_virtualFileToJob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function add(filePath, contents) {
	this.then(function (stimpak, thenDone) {
		_async2.default.waterfall([apply(_virtualFileToJob2.default, filePath, contents), apply(_removeSkippedJobs2.default, stimpak), apply(_renderJobPaths2.default, stimpak), apply(_removeSkippedJobs2.default, stimpak), apply(_addMergeStrategiesToJobs2.default, stimpak), apply(_jobsToFileMixers2.default, stimpak), _sortFileMixersByPathLength2.default, apply(_writeFileMixers2.default, stimpak)], thenDone);
	});
	return this;
}

function apply(step) {
	for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		values[_key - 1] = arguments[_key];
	}

	return _async2.default.apply.apply(_async2.default, [step].concat(values));
}