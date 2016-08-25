"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = removeSkippedJobs;

var _minimatch = require("minimatch");

var _minimatch2 = _interopRequireDefault(_minimatch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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