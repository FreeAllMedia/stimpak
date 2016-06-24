import privateData from "incognito";
import newTemplate from "lodash.template";
import templateSettings from "lodash.templatesettings";
import fileSystem from "fs-extra";
import File from "vinyl";
import Async from "flowsync";
import minimatch from "minimatch";
import flattenDeep from "lodash.flattendeep";
import glob from "glob";

// TODO: Refactor source.render into small files

export default function render(done) {
	const templateFileNames = glob.sync(this.glob(), {
		cwd: this.directory(),
		dot: true
	});

	Async.mapSeries(
		templateFileNames,
		(fileName, fileNameDone) => {
			try {
				renderFile.call(this.stimpak, fileName, this, fileNameDone);
			} catch (exception) {
				fileNameDone(exception);
			}
		},
		done
	);
}

function renderFile(templateFileName, source, done) {
	this.debug("renderFile", templateFileName);
	const templateFilePath = `${source.directory()}/${templateFileName}`;
	const templateFileStats = fileSystem.statSync(templateFilePath);
	const answers = this.answers();

	let destinationFileName = String(templateFileName);

	for (let answerName in answers) {
		const answerValue = answers[answerName];
		const answerRegExp = new RegExp(`##${answerName}##`, "g");
		destinationFileName = destinationFileName.replace(answerRegExp, answerValue);
	}

	if (!shouldSkipFile.call(this, destinationFileName, templateFileName)) {
		this.debug("file not skipped");
		if (templateFileStats.isDirectory()) {
			this.debug("file is directory");
			const directoryPath = `${this.destination()}/${destinationFileName}`;
			fileSystem.mkdirsSync(directoryPath);
			reportFile.call(this, directoryPath, {
				path: directoryPath,
				isDirectory: true,
				templatePath: templateFilePath,
				isMerged: false
			});
			reportEvent.call(this, {
				type: "writeDirectory",
				path: directoryPath,
				templatePath: templateFilePath
			});
			done();
		} else {
			this.debug("file is not a directory");
			const fileContents = renderTemplateFile.call(this, templateFilePath);

			const newFile = new File({
				cwd: this.destination(),
				base: this.destination(),
				path: `${this.destination()}/${destinationFileName}`,
				contents: new Buffer(fileContents)
			});

			const newFileDetails = {
				path: newFile.path,
				isDirectory: templateFileStats.isDirectory(),
				content: fileContents.toString(),
				templatePath: templateFilePath,
				isMerged: false
			};

			if (fileSystem.existsSync(newFile.path)) {
				this.debug("file exists");
				const oldFileContents = fileSystem.readFileSync(newFile.path);

				const mergeStrategies = this.merge();

				if (mergeStrategies.length > 0) {
					this.debug("there are merge strategies");

					let anyMergeStrategiesMatch = false;

					Async.mapSeries(mergeStrategies, (mergeStrategy, mergeDone) => {
						const mergePattern = new RegExp(mergeStrategy[0]);

						if (newFile.path.match(mergePattern)) {
							this.debug("merge strategy matched");
							anyMergeStrategiesMatch = true;
							const mergeFunction = mergeStrategy[1];
							const oldFile = new File({
								cwd: newFile.cwd,
								base: newFile.base,
								path: newFile.path,
								contents: oldFileContents
							});

							mergeFunction(this, newFile, oldFile, (error, mergedFile) => {
								const mergedFileDetails = newFileDetails;

								if (error) {
									mergeDone(error);
								} else {
									this.debug("merging file");
									mergedFileDetails.isMerged = true;
									mergedFileDetails.path = mergedFile.path;
									mergedFileDetails.oldContent = oldFile.contents.toString();
									mergedFileDetails.oldPath = oldFile.path;
									mergeFile.call(this, mergedFile, mergedFileDetails, mergeDone);
								}
							});
						} else {
							mergeDone();
						}
					}, error => {
						if (error) {
							done(error);
						} else {
							if (!anyMergeStrategiesMatch) {
								this.debug("merge strategies did not match");
								writeFile.call(this, newFile, newFileDetails, done);
							} else {
								done();
							}
						}
					});
				} else {
					this.debug("file does not have merge strategies");
					writeFile.call(this, newFile, newFileDetails, done);
				}
			} else {
				this.debug("file does not exist");
				writeFile.call(this, newFile, newFileDetails, done);
			}
		}
	} else {
		this.debug("file skipped");
		done();
	}
}

function renderTemplateFile(templateFilePath) {
	templateSettings.interpolate = /<%=([\s\S]+?)%>/g;

	const templateFileContents = fileSystem.readFileSync(templateFilePath);
	const template = newTemplate(templateFileContents);
	const renderedTemplateContents = template(this.answers());

	return renderedTemplateContents;
}

function mergeFile(file, fileDetails, done) {
	const filePath = file.path;
	const fileContents = file.contents;

	fileSystem.writeFileSync(
		filePath,
		fileContents
	);

	reportFile.call(this, filePath, fileDetails);
	reportEvent.call(this, {
		type: "mergeFile",
		path: fileDetails.path,
		oldPath: fileDetails.oldPath,
		templatePath: fileDetails.templatePath,
		content: fileDetails.content,
		oldContent: fileDetails.oldContent
	});

	done();
}

function writeFile(file, fileDetails, done) {
	const filePath = file.path;
	const fileContents = file.contents;

	fileSystem.writeFileSync(
		filePath,
		fileContents
	);

	reportFile.call(this, filePath, fileDetails);
	reportEvent.call(this, {
		type: "writeFile",
		path: fileDetails.path,
		templatePath: fileDetails.templatePath,
		content: fileDetails.content
	});

	done();
}

function reportFile(filePath, fileDetails) {
	privateData(this).report.files[filePath] = fileDetails;
}

function reportEvent(eventDetails) {
	privateData(this).report.events.push(eventDetails);
}

function shouldSkipFile(filePath, templateFileName) {
	const skips = this.skip();
	let skipFile = false;

	const flattenedSkips = flattenDeep(skips);

	for (let index in flattenedSkips) {
		const skipGlob = flattenedSkips[index];

		if (
			minimatch(filePath, skipGlob, { dot: true }) ||
			minimatch(templateFileName, skipGlob, { dot: true })
		) {
			skipFile = true;
			break;
		}
	}

	return skipFile;
}
