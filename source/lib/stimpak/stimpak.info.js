import util from "util";

export default function info(message, payload) {
	this.then(() => {
		let infoMessage = message;
		if (payload) {
			infoMessage += `(${util.inspect(payload)})`;
		}
		this.write(`\n${infoMessage}\n`);
	});
	return this;
}
