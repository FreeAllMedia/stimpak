import privateData from "incognito";
import { exec } from "child_process";

export default function command(commandString, afterCommand) {
	this.debug(".command", commandString);
	const _ = privateData(this);
	_.action
		.step((stimpak, done) => {
			exec(commandString, (error, stdout, stderr) => {
				if (afterCommand) {
					afterCommand(this, stdout, stderr, done);
				} else {
					done();
				}
			});
		});
	return this;
}
