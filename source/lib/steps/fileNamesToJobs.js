export default function fileNamesToJobs(globString, directoryPath, fileNames, done) {
	const jobs = fileNames.map(fileName => {
		const base = `${directoryPath}/`;
		const job = {
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
