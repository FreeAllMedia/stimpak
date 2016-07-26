import fileSystem from "fs";
import Async from "flowsync";
import privateData from "incognito";

export default function render(path, callback = () => {}) {
	fileSystem.exists(path, exists => {
		if (exists) {
			fileDoesntExist(this, path, callback);
		} else {
			fileExists(this, path, callback);
		}
	});

	return this;
}

function fileExists(template, path, callback) {
	renderTemplate(template, (error, renderedTemplate) => {
		writeFile(path, renderedTemplate, callback);
	});
}

function fileDoesntExist(template, path, callback) {
	Async.waterfall([
		done => {
			renderTemplate(template, done);
		},
		(renderedTemplate, done) => {
			readExistingFile(path, (error, existingContent) => {
				done(error, renderedTemplate, existingContent);
			});
		},
		(renderedTemplate, existingContent, done) => {
			diffContent(template, existingContent, renderedTemplate, done);
		},
		(renderedTemplate, existingContent, done) => {
			mergeContent(template, existingContent, renderedTemplate, done);
		},
		(mergedContent, done) => {
			writeFile(path, mergedContent, done);
		}
	], callback);
}

function readExistingFile(path, done) {
	fileSystem.readFile(
		path,
		{ encoding: "utf8" },
		done
	);
}

function renderTemplate(template, callback) {
	const templateEngine = template.engine();

	switch (templateEngine.length) {
		case 0:
		case 1: {
			try {
				const renderedTemplate = templateEngine(template);
				callback(null, renderedTemplate);
			} catch (exception) {
				callback(exception);
			}
			break;
		}
		case 2:
			templateEngine(template, callback);
			break;
	}
}

function writeFile(path, content, done) {
	fileSystem.writeFile(path, content, done);
}

function mergeContent(template, existingContent, newContent, done) {
	const mergeStrategy = template.merge();
	if (mergeStrategy) {
		switch (mergeStrategy.length) {
			case 4:
				mergeStrategy(template, existingContent, newContent, done);
				break;
			case 3:
				try {
					const mergedContent = mergeStrategy(template, existingContent, newContent);
					done(null, mergedContent);
				} catch (exception) {
					done(exception);
				}
				break;
			default:
				done(new Error("Merge stategies must have either 3 or 4 arguments."));
		}
	} else {
		done(null, newContent);
	}
}

function diffContent(template, existingContent, newContent, done) {
	const diff = template.difference();
}
