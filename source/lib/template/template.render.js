import fileSystem from "fs";

export default function render(callback) {
	const templateEngine = this.engine();

	templateEngine(this, (error, renderedTemplate) => {
		fileSystem.writeFileSync(this.path(), renderedTemplate);
		callback(error);
	});

	return this;
}
