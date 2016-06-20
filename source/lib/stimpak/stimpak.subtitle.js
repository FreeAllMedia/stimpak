import privateData from "incognito";

export default function subtitle(message = "Sub-Title") {
	this.debug("subtitle", message);

	const needsLineBreak = Boolean(privateData(this).needsLineBreak);

	this.then(() => {
		message = ` ${message}\n`;
		if (needsLineBreak) {
			message = `\n${message}`;
		}
		process.stdout.write(message);
	});

	return this;
}
