import privateData from "incognito";
import newTemplate from "lodash.template";
import templateSettings from "lodash.templatesettings";
import glob from "glob";
import fileSystem from "fs-extra";
import File from "vinyl";
import Async from "flowsync";
import minimatch from "minimatch";
import flattenDeep from "lodash.flattendeep";

export default function generate(callback) {
	this.debug("generate");

	if (this.destination()) {
		const _ = privateData(this);
		const action = _.action;

		action
			.results(error => {
				if (!error) {
					renderFiles.call(this, this, callback);
				} else {
					callback(error);
				}
			});
	} else {
		callback(new Error("You must set .destination() before you can .generate()"));
	}

	return this;
}

function renderFiles(stimpak, done) {
	Async.mapSeries(
		stimpak.sources,
		renderSource.bind(this),
		done
	);
}

function renderSource(source, done) {
	const templateFileNames = glob.sync(source.glob(), {
		cwd: source.directory(),
		dot: true
	});

	Async.mapSeries(
		templateFileNames,
		(fileName, fileNameDone) => {
			renderFile.call(this, fileName, source, fileNameDone);
		},
		done
	);
}

// TODO: Clean up renderFile by breaking it up into smaller functions
function renderFile(templateFileName, source, done) {
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
		if (templateFileStats.isDirectory()) {
			fileSystem.mkdirsSync(`${this.destination()}/${destinationFileName}`);
			done();
		} else {
			const fileContents = renderTemplateFile.call(this, templateFilePath);

			const newFile = new File({
				cwd: this.destination(),
				base: this.destination(),
				path: `${this.destination()}/${destinationFileName}`,
				contents: new Buffer(fileContents)
			});

			if (fileSystem.existsSync(newFile.path)) {
				const oldFileContents = fileSystem.readFileSync(newFile.path);

				const mergeStrategies = this.merge();

				if (mergeStrategies.length > 0) {
					Async.mapSeries(mergeStrategies, (mergeStrategy, mergeDone) => {
						const mergePattern = new RegExp(mergeStrategy[0]);

						if (newFile.path.match(mergePattern)) {
							const mergeFunction = mergeStrategy[1];
							const oldFile = new File({
								cwd: newFile.cwd,
								base: newFile.base,
								path: newFile.path,
								contents: oldFileContents
							});

							mergeFunction(this, newFile, oldFile, (error, mergedFile) => {
								if (error) {
									mergeDone(error);
								} else {
									writeFile(mergedFile.path, mergedFile.contents, mergeDone);
								}
							});
						} else {
							writeFile(newFile.path, newFile.contents, mergeDone);
						}
					}, done);
				} else {
					writeFile(newFile.path, newFile.contents, done);
				}
			} else {
				writeFile(newFile.path, newFile.contents, done);
			}
		}
	} else {
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

function writeFile(filePath, fileContents, done) {
	fileSystem.writeFileSync(
		filePath,
		fileContents
	);
	done();
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
