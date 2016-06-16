import util from "util";

export default function info(message, payload) {
	let infoMessage = message;
	if (payload) {
		infoMessage += `(${util.inspect(payload)})`;
	}
	process.stdout.write(`\n[ ${infoMessage} ]\n`);
	return this;
}
