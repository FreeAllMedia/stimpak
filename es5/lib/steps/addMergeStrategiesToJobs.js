"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = addMergeStrategiesToJobs;

var _minimatch = require("minimatch");

var _minimatch2 = _interopRequireDefault(_minimatch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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