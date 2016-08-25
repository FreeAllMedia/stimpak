"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = renderJobPaths;
function renderJobPaths(stimpak, jobs, done) {
	jobs.forEach(function (job) {
		job.name = renderPlaceholders(stimpak, job.name);
	});

	done(null, jobs);
}

function renderPlaceholders(stimpak, path) {
	var answers = stimpak.answers();

	for (var key in answers) {
		var answer = answers[key];
		path = path.replace(new RegExp("##" + key + "##", "g"), answer);
	}

	return path;
}