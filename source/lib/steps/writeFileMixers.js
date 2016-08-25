import Async from "async";
import fileSystem from "fs";
import path from "path";

export default function writeFileMixers(stimpak, fileMixers, done) {
	Async.mapSeries(fileMixers, Async.apply(writeFileMixer, stimpak), done);
}

function writeFileMixer(stimpak, fileMixer, done) {
	const report = stimpak.report;

	const pathParts = path.dirname(fileMixer.path()).split("/");

	const missingPaths = [];

	Async.whilst(() => pathParts.length > 1, whilstDone => {
		const pathToCheck = pathParts.join("/");

		fileSystem.exists(pathToCheck, exists => {
			if (!exists) {
				missingPaths.push(pathToCheck);
			}
			whilstDone();
		});

		pathParts.pop();
	}, () => {
		fileMixer.write((error, file) => {
			missingPaths.reverse().forEach(missingPath => {
				report.events.push({
					type: "writeDirectory",
					path: missingPath
				});

				const base = file.base;
				const name = missingPath.replace(base, "");

				report.files[missingPath] = {
					path: missingPath,
					base: base,
					name: name,
					isDirectory: true,
					isFile: false,
					isMerged: false
				};
			});

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
	});
}
