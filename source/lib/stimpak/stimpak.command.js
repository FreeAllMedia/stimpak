import privateData from "incognito";
import { exec } from "child_process";

export default function command(commandString, afterCommand) {
	this.debug("commandString")
	const _ = privateData(this);
	_.action
		.step((stimpak, done) => {
			exec(commandString, (error, stdout, stderr) => {
				afterCommand(this, stdout, stderr, done);
			});
		});
	return this;
}
