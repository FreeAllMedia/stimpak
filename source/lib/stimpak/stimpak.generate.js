import privateData from "incognito";
import newTemplate from "lodash.template";
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
	let templateFilePaths = [];

	stimpak.sources.forEach(source => {
		const absoluteSourceGlob = `${source.directory()}/${source.glob()}`;
		const sourceFilePaths = glob.sync(absoluteSourceGlob);

		templateFilePaths = templateFilePaths.concat(sourceFilePaths);
	});

	templateFilePaths.forEach(templateFilePath => {
		const renderedTemplateContents = renderTemplateFile.call(this, templateFilePath);

		const answers = this.answers();
		for (let answerName in answers) {
			const answerValue = answers[answerName];

			const answerRegExp = new RegExp(`##${answerName}##`, "g");

			templateFilePath = templateFilePath.replace(answerRegExp, answerValue);
		}

		const templateFile = newFile.call(this, templateFilePath, renderedTemplateContents);

		console.log("templateFile", templateFile);
	});

	done();
}

function renderTemplateFile(templateFilePath) {
	const templateFileContents = fileSystem.readFileSync(templateFilePath);

	const template = newTemplate(templateFileContents);

	const renderedTemplateContents = template(this.answers());

	return renderedTemplateContents;
}

function newFile(filePath, fileContents) {
	const templateFile = new File({
		cwd: this.destination(),
		base: this.basePath(),
		path: filePath,
		contents: new Buffer(fileContents)
	});

	return templateFile;
}
