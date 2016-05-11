import privateData from "incognito";
import Action from "staircase";
import promptly from "promptly";
import ChainLink from "mrt";

import Source from "../source/source.js";

export { Source };

const externalFunction = Symbol(),
			initializePrivateData = Symbol(),
			initializeInterface = Symbol(),
			initializeDefaults = Symbol();

export default class Stimpak extends ChainLink {
	initialize() {
		this[initializePrivateData]();
		this[initializeInterface]();
		this[initializeDefaults]();
	}

	[initializePrivateData]() {
		const _ = privateData(this);
		_.action = new Action(this);
		_.promptly = promptly;
	}

	[initializeInterface]() {
		this.steps = privateData(this).action.steps;
		this.generators = [];

		this
			.link("source", Source)
				.into("sources");

		this
			.parameters(
				"destination",
				"answers"
			);

		this
			.parameters(
				"merge"
			)
				.multiValue
				.aggregate;
	}

	[initializeDefaults]() {
		this.answers({});
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
}
