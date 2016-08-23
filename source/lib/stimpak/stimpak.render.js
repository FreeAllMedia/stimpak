import FileMixer from "filemixer";
import fileSystem from "fs";
import Async from "async";
import minimatch from "minimatch";
import privateData from "incognito";
import sortByPathLength from "../sorters/sortByPathLength.js";
import globToFileNames from "../steps/globToFileNames.js";
import isJSON from "is-json";
import mergeJSON from "../mergers/mergeJSON.js";
import mergeText from "../mergers/mergeText.js";

export default function render(globString, directoryPath) {
	this.then((stimpak, thenDone) => {
		const steps = [
			Async.apply(globToFileNames, globString, directoryPath),
			Async.apply(fileNamesToJobs, globString, directoryPath),
			Async.apply(removeSkippedJobs, stimpak),
			Async.apply(renderJobPaths, stimpak),
			Async.apply(removeSkippedJobs, stimpak),
			Async.apply(addMergeStrategiesToJobs, stimpak),
			Async.apply(jobsToFileMixers, stimpak),
			sortFileMixersByPathLength,
			Async.apply(writeFileMixers, stimpak),
			Async.apply(reportEventsAndFiles, stimpak)
		];

		Async.waterfall(steps, thenDone);
	});
	return this;
}

// Steps below here
//
// TODO: Break these out into other files

function reportEventsAndFiles(stimpak, files, done) {


	done();
}

function writeFileMixers(stimpak, fileMixers, done) {
	Async.mapSeries(fileMixers, Async.apply(writeFileMixer, stimpak), done);
}

function writeFileMixer(stimpak, fileMixer, done) {
	const report = privateData(stimpak).report;

	fileMixer.write((error, file) => {
		let event;
		if (!error) {
			if (!file.isMerged) {
				if (file.isFile) {
					event = {
						type: "writeFile",
						templatePath: fileMixer.templatePath,
						path: file.path,
						contents: file.contents
					};
				} else {
					event = {
						type: "writeDirectory",
						templatePath: fileMixer.templatePath,
						path: file.path
					};

					delete file.contents;
				}

				file.templatePath = fileMixer.templatePath;

				report.events.push(event);
				report.files[file.path] = file;
			} else {
				report.events.push({
					contents: file.contents,
					oldContents: fileMixer.originalContents,
					oldPath: fileMixer.originalPath,
					path: file.path,
					templatePath: fileMixer.templatePath,
					type: "mergeFile"
				});

				const reportFileObject = Object.assign({
					templatePath: fileMixer.templatePath,
					oldContents: fileMixer.originalContents,
					oldPath: fileMixer.originalPath
				}, file);

				stimpak.report.files[file.path] = reportFileObject;
			}
			done(null, file);
		} else {
			error.message = error.message.replace(/(.*) is not defined/, `"$1" is not defined in "${fileMixer.templatePath}"`);
			done(error);
		}
	});
}

function sortFileMixersByPathLength(fileMixers, done) {
	const sortedFileMixers = fileMixers.sort(sortByPathLength);
	done(null, sortedFileMixers);
}

function jobsToFileMixers(stimpak, jobs, done) {
	Async.mapSeries(jobs, Async.apply(jobToFileMixer, stimpak), done);
}

function fileNamesToJobs(globString, directoryPath, fileNames, done) {
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

function renderJobPaths(stimpak, jobs, done) {
	jobs.forEach(job => {
		job.name = renderPlaceholders(stimpak, job.name);
	});

	done(null, jobs);
}

function addMergeStrategiesToJobs(stimpak, jobs, callback) {
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

function jobToFileMixer(stimpak, job, readDone) {
	const name = job.name;
	const templatePath = job.templatePath;
	const destinationBase = `${stimpak.destination()}/`;
	const destinationPath = destinationBase + name;

	Async.waterfall([
		done => {
			fileSystem.stat(templatePath, (error, stats) => {
				done(null, stats);
			});
		},
		(stats, done) => {
			if (stats.isFile()) {
				fileSystem.readFile(templatePath, { encoding: "utf8" }, done);
			} else {
				done(null, null);
			}
		},
		(contents, done) => {
			const fileMixer = new FileMixer({
				path: destinationPath,
				contents,
				base: destinationBase
			});

			if (job.mergeStrategies.length > 0) {
				const mergeWithAllStrategies = (self, oldFile, newFile, mergeDone) => {
					let currentFile = newFile;
					Async.mapSeries(job.mergeStrategies, (mergeStrategy, mergeStrategyDone) => {
						let mergeFunction = mergeStrategy[1];

						if (!mergeFunction) {
							if (isJSON(oldFile.contents.toString()) && isJSON(newFile.contents).toString()) {
								mergeFunction = mergeJSON;
							} else {
								mergeFunction = mergeText;
							}
						}

						fileMixer.originalContents = oldFile.contents;
						fileMixer.originalPath = oldFile.path;

						mergeFunction(stimpak, oldFile, currentFile, (error, mergedFile) => {
							if (!error) {
								mergedFile.isMerged = true;
								currentFile = mergedFile;
							}
							mergeStrategyDone(error);
						});
					}, error => {
						if (!error) {
							const mergedFile = currentFile;
							mergeDone(null, mergedFile);
						} else {
							mergeDone(error);
						}
					});
				};

				fileMixer.merge(mergeWithAllStrategies);
			}



			fileMixer.values(stimpak.answers());
			fileMixer.templatePath = templatePath;

			done(null, fileMixer);
		}
	], readDone);
}

function removeSkippedJobs(stimpak, jobs, done) {
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

function renderPlaceholders(stimpak, path) {
	const answers = stimpak.answers();

	for (let key in answers) {
		const answer = answers[key];
		path = path.replace(new RegExp(`##${key}##`, "g"), answer);
	}

	return path;
}
