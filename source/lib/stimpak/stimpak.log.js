import util from "util";

export default function log(message, payload) {
	let logMessage = message;
	if (payload) {
		logMessage += `(${util.inspect(payload)})`;
	}
	this.logStream().write(logMessage);
	return this;
}
