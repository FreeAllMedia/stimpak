"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = fileNamesToJobs;
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