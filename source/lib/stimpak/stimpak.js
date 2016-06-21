import privateData from "incognito";
import Action from "staircase";
import ChainLink from "mrt";

import Source from "../source/source.js";

export { Source };

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
	}

	[initializeInterface]() {
		this.steps = privateData(this).action.steps;
		this.generators = [];

		this
			.link("source", Source)
				.into("sources");

		this.parameters(
			"destination",
			"debugStream",
			"logStream"
		);

		this.parameters(
			"skip"
		).aggregate;

		this.parameters(
			"casts"
		).aggregate;

		this.parameters(
			"answers"
		).mergeKeyValues;

		this.parameters(
			"merge"
		).multiValue.aggregate;
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

	use(...generators) {
		return this[externalFunction]("./stimpak.use.js", ...generators);
	}

	then(...stepFunctions) {
		return this[externalFunction]("./stimpak.then.js", ...stepFunctions);
	}

	cast(callback) {
		return this[externalFunction]("./stimpak.cast.js", callback);
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

	subtitle(message) {
		return this[externalFunction]("./stimpak.subtitle.js", message);
	}

	log(message, payload) {
		return this[externalFunction]("./stimpak.log.js", message, payload);
	}

	debug(message, payload) {
		return require("./stimpak.debug.js").default.call(this, message, payload);
	}

	get test() {
		return this[externalFunction]("./stimpak.test.js");
	}
}
