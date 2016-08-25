export default function renderJobPaths(stimpak, jobs, done) {
	jobs.forEach(job => {
		job.name = renderPlaceholders(stimpak, job.name);
	});

	done(null, jobs);
}

function renderPlaceholders(stimpak, path) {
	const answers = stimpak.answers();

	for (let key in answers) {
		const answer = answers[key];
		path = path.replace(new RegExp(`##${key}##`, "g"), answer);
	}

	return path;
}
