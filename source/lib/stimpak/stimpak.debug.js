import util from "util";

export default function debug(message, payload) {
	if (this.debugStream()) {
		let debugMessage = message;
		if (payload) {
			debugMessage += `(${util.inspect(payload)})`;
		}
		this.debugStream().write(`${debugMessage}\n`);
	}
	return this;
}
