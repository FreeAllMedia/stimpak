import util from "util";

export default function log(message, payload) {
	const debugStream = this.debug();
	if (debugStream) {
		const date = new Date().toISOString().slice(11, -5);
		let line = `[${date}] ${message}\n`;

		if (payload) {
			line += `${util.inspect(payload)}\n`;
		}

		debugStream.write(line);
	}

	return this;
}
