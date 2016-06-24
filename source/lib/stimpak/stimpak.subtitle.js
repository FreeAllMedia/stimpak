export default function subtitle(message = "Sub-Title") {
	this.debug("subtitle", message);

	this.then(() => {
		this.write(`\n ${message}\n`);
	});

	return this;
}
