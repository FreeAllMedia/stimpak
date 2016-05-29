import privateData from "incognito";
import Action from "staircase";
import ChainLink from "mrt";

import Source from "../source/source.js";

export { Source };

const externalFunction = Symbol(),
			initializePrivateData = Symbol(),
			initializeInterface = Symbol();

export default class Stimpak extends ChainLink {
	initialize() {
		this[initializePrivateData]();
		this[initializeInterface]();
	}

	[initializePrivateData]() {
		const _ = privateData(this);
		_.action = new Action(this);
	}

	[initializeInterface]() {
		this.steps = privateData(this).action.steps;
		this.generators = [];

		this
			.link("source", Source)
				.into("sources");

		this.parameters(
			"destination"
		);

		this.parameters(
			"answers"
		).mergeKeyValues;

		this.parameters(
			"merge"
		).multiValue.aggregate;
	}

	[externalFunction](functionFilePath, ...options) {
		return require(functionFilePath).default.call(this, ...options);
	}

	use(...generators) {
		return this[externalFunction]("./stimpak.use.js", ...generators);
	}

	then(...stepFunctions) {
		return this[externalFunction]("./stimpak.then.js", ...stepFunctions);
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

	logo(message) {
		return this[externalFunction]("./stimpak.logo.js", message);
	}
}
