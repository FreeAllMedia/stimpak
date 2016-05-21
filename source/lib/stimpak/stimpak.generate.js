import privateData from "incognito";
import newTemplate from "lodash.template";
import templateSettings from "lodash.templatesettings";
import glob from "glob";
import fileSystem from "fs";
import File from "vinyl";
import Async from "flowsync";

export default function generate(callback) {
	if (this.destination()) {
		const _ = privateData(this);
		const action = _.action;

		action
			.step(renderFiles.bind(this))
			.results(callback);
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

// TODO: Clean up function by breaking it up into smaller ones
function renderFile(fileName, source, done) {
	const templateFilePath = `${source.directory()}/${fileName}`;
	const templateFileStats = fileSystem.statSync(templateFilePath);
	const answers = this.answers();

	let filePath = `${fileName}`;

	for (let answerName in answers) {
		const answerValue = answers[answerName];
		const answerRegExp = new RegExp(`##${answerName}##`, "g");
		filePath = filePath.replace(answerRegExp, answerValue);
	}

	if (templateFileStats.isDirectory()) {
		fileSystem.mkdirSync(`${this.destination()}/${filePath}`);
		done();
	} else {
		const fileContents = renderTemplateFile.call(this, templateFilePath);

		const newFile = new File({
			cwd: this.destination(),
			base: this.destination(),
			path: `${this.destination()}/${filePath}`,
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
