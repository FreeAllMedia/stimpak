import minimatch from "minimatch";

export default function removeSkippedJobs(stimpak, jobs, done) {
	const filteredJobs = jobs.filter(job => shouldRenderJob(stimpak, job));
	done(null, filteredJobs);
}

function shouldRenderJob(stimpak, job) {
	let skipStrings = stimpak.skip();

	skipStrings = skipStrings.concat.apply([], skipStrings);

	let shouldRender = true;

	skipStrings.forEach(skipString => {
		const name = job.name;

		const templatePath = `${job.base}/${job.name}`;
		const destinationPath = `${stimpak.destination()}/${job.name}`;

		const minimatchOptions = { dot: true };

		const templatePathMatched = minimatch(templatePath, skipString, minimatchOptions);
		const destinationPathMatched = minimatch(destinationPath, skipString, minimatchOptions);
		const nameMatched = minimatch(name, skipString, minimatchOptions);

		if (nameMatched || templatePathMatched || destinationPathMatched) {
			shouldRender = false;
		}
	});

	return shouldRender;
}
