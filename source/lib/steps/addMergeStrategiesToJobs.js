import minimatch from "minimatch";

export default function addMergeStrategiesToJobs(stimpak, jobs, callback) {
	jobs.forEach(job => {
		const fileName = job.name;
		const mergeStrategies = stimpak.merge();

		const matchedStrategies = [];

		mergeStrategies.forEach(mergeStrategy => {
			const globString = mergeStrategy[0];
			const shouldMerge = minimatch(fileName, globString);

			if (shouldMerge) {
				matchedStrategies.push(mergeStrategy);
			}
		});

		job.mergeStrategies = matchedStrategies;
	});

	callback(null, jobs);
}
