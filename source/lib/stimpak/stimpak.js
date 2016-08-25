import privateData from "incognito";
import Action from "staircase";
import ChainLink from "mrt";

const externalFunction = Symbol(),
			initializePrivateData = Symbol(),
			initializeInterface = Symbol(),
			parseOptions = Symbol(),
			addLineBreak = Symbol();

export default class Stimpak extends ChainLink {
	initialize(options) {
		this[initializePrivateData]();
		this[initializeInterface]();
		this[parseOptions](options);
	}

	[initializePrivateData]() {
		const _ = privateData(this);
		_.action = new Action(this);
		_.action.context(this);
		_.report = {
			events: [],
			files: {},
			diffFixtures: require("./stimpak.report.diffFixtures.js").default.bind(this)
		};
	}

	[initializeInterface]() {
		this.steps = privateData(this).action.steps;
		this.generators = [];
		this.sources = [];

		this.properties(
			"destination",
			"debugStream",
			"logStream"
		);

		this.properties(
			"skip"
		).aggregate;

		this.properties(
			"transforms"
		).aggregate;

		this.properties("answers")
			.merged
			.filter(answer => {
				let transformedAnswerValue = answer;
				function transformUnlessFalsy(originalValue, transform) {
					let transformedValue = transform(originalValue);

					/* eslint-disable eqeqeq */
					if (transformedValue == false || isNaN(transformedValue)) {
						transformedValue = originalValue;
					}

					return transformedValue;
				}

				this.transforms().forEach(transformFunction => {
					if (transformedAnswerValue.constructor === Array) {
						transformedAnswerValue = transformedAnswerValue.map(value => {
							return transformUnlessFalsy(value, transformFunction);
						});
					} else {
						transformedAnswerValue = transformUnlessFalsy(transformedAnswerValue, transformFunction);
					}
				});

				return transformedAnswerValue;
			});

		this.properties(
			"merge"
		).multi.aggregate;
	}

	[parseOptions](options = {}) {
		this.debugStream(options.debugStream);
		this.logStream(options.logStream || process.stdout);
	}

	[externalFunction](functionFilePath, ...options) {
		this.debug(`externalFunction: ${functionFilePath}`, options);

		this[addLineBreak](functionFilePath);

		const returnValue = require(functionFilePath).default.call(this, ...options);

		return returnValue;
	}

	[addLineBreak](functionFilePath) {
		const _ = privateData(this);

		let notDefined;

		_.needsLineBreak = false;

		switch (functionFilePath) {
			case "./stimpak.prompt.js":
				switch (_.lastWritingStepType) {
					case "./stimpak.note.js":
					case "./stimpak.info.js":
					case "./stimpak.title.js":
					case "./stimpak.subtitle.js":
					case notDefined:
						_.needsLineBreak = true;
				}
				_.lastWritingStepType = functionFilePath;
				break;
			case "./stimpak.note.js":
			case "./stimpak.info.js":
			case "./stimpak.title.js":
			case "./stimpak.subtitle.js":
				_.lastWritingStepType = functionFilePath;
		}

		// console.log({
		// 	functionFilePath: functionFilePath,
		// 	lastStepType: _.lastWritingStepType,
		// 	needsLineBreak: _.needsLineBreak
		// });
	}

	get report() {
		return privateData(this).report;
	}

	use(...generators) {
		return this[externalFunction]("./stimpak.use.js", ...generators);
	}

	then(...stepFunctions) {
		return this[externalFunction]("./stimpak.then.js", ...stepFunctions);
	}

	// file(path, content) {
	// 	return this[externalFunction]("./stimpak.file.js", path, content);
	// }

	transform(callback) {
		return this[externalFunction]("./stimpak.transform.js", callback);
	}

	context(object) {
		return this[externalFunction]("./stimpak.context.js", object);
	}

	command(command, callback) {
		return this[externalFunction]("./stimpak.command.js", command, callback);
	}

	prompt(...prompts) {
		return this[externalFunction]("./stimpak.prompt.js", ...prompts);
	}

	generate(callback) {
		return this[externalFunction]("./stimpak.generate.js", callback);
	}

	note(message) {
		return this[externalFunction]("./stimpak.note.js", message);
	}

	info(message, payload) {
		return this[externalFunction]("./stimpak.info.js", message, payload);
	}

	title(message, font) {
		return this[externalFunction]("./stimpak.title.js", message, font);
	}

	subtitle(message, font) {
		return this[externalFunction]("./stimpak.subtitle.js", message, font);
	}

	log(message, payload) {
		return this[externalFunction]("./stimpak.log.js", message, payload);
	}

	render(globString, directoryPath) {
		return this[externalFunction]("./stimpak.render.js", globString, directoryPath);
	}

	add(path, contents) {
		return this[externalFunction]("./stimpak.add.js", path, contents);
	}

	debug(message, payload) {
		return require("./stimpak.debug.js").default.call(this, message, payload);
	}

	get test() {
		return this[externalFunction]("./stimpak.test.js");
	}

	write(message) {
		process.stdout.write(message);
	}
}
