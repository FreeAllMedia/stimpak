import Async from "async";
import fileSystem from "fs";
import FileMixer from "filemixer";
import path from "path";

import isJSON from "is-json";
import mergeJSON from "../mergers/mergeJSON.js";
import mergeText from "../mergers/mergeText.js";

export default function jobsToFileMixers(stimpak, jobs, done) {
	Async.mapSeries(jobs, Async.apply(jobToFileMixer, stimpak), done);
}

function jobToFileMixer(stimpak, job, readDone) {
	const name = job.name;

	let destinationBase = `${stimpak.destination()}/`;
	let destinationPath = `${destinationBase}${name}`;

	const templatePath = job.templatePath;

	let steps = [];

	if (templatePath) {
		steps = steps.concat([
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
			}
		]);
	} else {
		const pathIsAbsolute = path.resolve(job.path) === path.normalize(job.path);

		if (pathIsAbsolute) {
			destinationPath = job.path;
			destinationBase = path.dirname(job.path) + "/";
		} else {
			destinationPath = `${destinationBase}${job.path}`;
		}

		steps.push(done => done(null, job.contents));
	}

	steps.push((contents, done) => {
		const fileMixerOptions = {
			path: destinationPath,
			contents,
			base: destinationBase
		};

		const fileMixer = new FileMixer(fileMixerOptions);

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
	});

	Async.waterfall(steps, readDone);
}
