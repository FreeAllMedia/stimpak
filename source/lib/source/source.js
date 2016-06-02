import ChainLink from "mrt";

const initializeInterface = Symbol(),
			initializeDefaults = Symbol();

export default class Source extends ChainLink {
	initialize(globString, directory) {
		this[initializeInterface]();
		this[initializeDefaults](globString, directory);
	}

	[initializeInterface]() {
		this.parameters(
			"glob",
			"basePath",
			"directory"
		);
	}

	[initializeDefaults](globString = "**/*", directory) {
		this.glob(globString);
		this.directory(directory);
		this.basePath(this.directory());
	}
}
