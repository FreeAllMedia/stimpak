import ChainLink from "mrt";

const initializeInterface = Symbol(),
			initializeDefaults = Symbol();

export default class Source extends ChainLink {
	initialize(stimpak, globString, directory) {
		this.stimpak = stimpak;

		this[initializeInterface]();
		this[initializeDefaults](globString, directory);

		stimpak.then((self, done) => {
			this.render(done);
		});
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

	render(callback) {
		return require("./source.render.js").default.call(this, callback);
	}
}
