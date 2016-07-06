import privateData from "incognito";
import { exec } from "child_process";

export default function command(commandString, afterCommand) {
	this.debug(".command", commandString);
	const _ = privateData(this);
	_.action
		.step((stimpak, done) => {
			exec(commandString, (error, stdout, stderr) => {
				_.report.events.push({
					type: "command",
					command: commandString,
					stdout: stdout,
					stderr: stderr
				});
				if (afterCommand) {
					switch (afterCommand.length) {
						case 4:
							afterCommand(this, stdout, stderr, done);
							break;
						default:
							try {
								afterCommand(this, stdout, stderr);
								done();
							} catch (exception) {
								done(exception);
							}
					}
				} else {
					done();
				}
			});
		});
	return this;
}
