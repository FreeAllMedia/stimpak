import privateData from "incognito";
import { exec } from "child_process";

export default function command(commandString, afterCommand) {
	const _ = privateData(this);
	console.log("FUM");
	_.action
		.step((stimpak, done) => {
			console.log("FEE");
			exec(commandString, (error, stdout, stderr) => {
				console.log("FI");
				afterCommand(this, stdout, stderr, done);
			});
		});
	return this;
}
