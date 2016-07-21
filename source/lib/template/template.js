import ChainLink from "mrt";
import Vinyl from "vinyl";
import ejs from "ejs";

const externalFunction = Symbol();

class File extends ChainLink {
	initialize(path, content, values) {
		this.parameters(
			"path",
			"content",
			"vinyl",
			"engine",
			"debug"
		);

		this.parameters(
			"values"
		).merge;

		this.path(path);
		this.content(content);
		this.vinyl(new Vinyl());
		this.values(values);
		this.engine((self, complete) => {
			const rendered = ejs.render(this.content(), this.values());
			complete(null, rendered);
		});
	}

	render(callback) {
		return this[externalFunction](`${__dirname}/template.render.js`, callback);
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
