export default function subtitle(message = "Sub-Title") {
	this.debug("subtitle", message);

	this.then(() => {
		process.stdout.write(`\n ${message}\n`);
	});

	return this;
}
