import privateData from "incognito";
import Action from "staircase";
import promptly from "promptly";
import ChainLink from "mrt";

const externalFunction = Symbol();

export default class Stimpak extends ChainLink {
	initialize() {
		const _ = privateData(this);
		_.action = new Action(this);
		_.promptly = promptly;

		this.answers = {};
		this.steps = _.action.steps;
		this.generators = [];

		this
			.parameters("destination");

		this
			.parameters(
				"source",
				"onMerge"
			)
				.multiValue
				.aggregate;
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

	[externalFunction](functionFilePath, ...options) {
		return require(functionFilePath).default.call(this, ...options);
	}
}
