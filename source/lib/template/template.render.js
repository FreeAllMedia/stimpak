import fileSystem from "fs";

export default function render(path, callback = () => {}) {
	const templateEngine = this.engine();

	switch (templateEngine.length) {
		case 0:
		case 1: {
			const renderedTemplate = templateEngine(this);

			fileSystem.writeFileSync(path, renderedTemplate);

			callback();
			break;
		}
		case 2:
			templateEngine(this, (error, renderedTemplate) => {
				fileSystem.writeFileSync(path, renderedTemplate);
				callback(error);
			});
			break;
	}

	return this;
}
