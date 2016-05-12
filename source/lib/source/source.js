import ChainLink from "mrt";

const initializeInterface = Symbol(),
			initializeDefaults = Symbol();

export default class Source extends ChainLink {
	initialize(globString) {
		this[initializeInterface]();
		this[initializeDefaults](globString);
	}

	[initializeInterface]() {
		this.parameters(
			"glob",
			"basePath",
			"directory"
		);
	}

	[initializeDefaults](globString = "**/*") {
		this.glob(globString);
		this.directory(process.cwd());
		this.basePath(this.directory());
	}
}
