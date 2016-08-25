import Async from "async";

import globToFileNames from "../steps/globToFileNames.js";
import fileNamesToJobs from "../steps/fileNamesToJobs.js";
import addMergeStrategiesToJobs from "../steps/addMergeStrategiesToJobs.js";
import writeFileMixers from "../steps/writeFileMixers.js";
import sortFileMixersByPathLength from "../steps/sortFileMixersByPathLength.js";
import jobsToFileMixers from "../steps/jobsToFileMixers.js";
import renderJobPaths from "../steps/renderJobPaths.js";
import removeSkippedJobs from "../steps/removeSkippedJobs.js";

export default function render(globString, directoryPath) {
	this.then((stimpak, thenDone) => {
		Async.waterfall([
			apply(globToFileNames, globString, directoryPath),
			apply(fileNamesToJobs, globString, directoryPath),
			apply(removeSkippedJobs, stimpak),
			apply(renderJobPaths, stimpak),
			apply(removeSkippedJobs, stimpak),
			apply(addMergeStrategiesToJobs, stimpak),
			apply(jobsToFileMixers, stimpak),
			sortFileMixersByPathLength,
			apply(writeFileMixers, stimpak)
		], thenDone);
	});
	return this;
}

function apply(step, ...values) {
	return Async.apply(step, ...values);
}
