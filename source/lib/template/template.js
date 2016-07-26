import ChainLink from "mrt";
import ejs from "ejs";
// import privateData from "incognito";

const externalFunction = Symbol();

class File extends ChainLink {
	initialize(options = {}) {
		this.parameters(
			"content",
			"engine",
			"debug",
			"merge",
			"difference"
		);

		this.parameters(
			"values"
		).merge;

		this.content(options.content);
		this.values(options.values);
		this.engine((self, complete) => {
			const rendered = ejs.render(this.content(), this.values());
			complete(null, rendered);
		});
	}

	render(path, callback) {
		return this[externalFunction](`${__dirname}/template.render.js`, path, callback);
	}

	log(message, payload) {
		return this[externalFunction](`${__dirname}/template.log.js`, message, payload);
	}

	[externalFunction](functionFilePath, ...options) {
		const returnValue = require(functionFilePath).default.call(this, ...options);

		return returnValue;
	}
}

export default File;
