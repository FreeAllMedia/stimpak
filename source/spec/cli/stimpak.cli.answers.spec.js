import { exec as runCommand } from "child_process";
import { setupCliEnvironment } from "./stimpak.cli.helper.js";

describe("(CLI) stimpak --answers", () => {
	let command,
	    userProjectDirectoryPath;

	beforeEach(() => {
		const options = setupCliEnvironment();
		command = options.command;
		userProjectDirectoryPath = options.userProjectDirectoryPath;
	});

	it("should use provided answer and skip question prompt", done => {
		command += " test-4";
		runCommand(command, { cwd: userProjectDirectoryPath }, (error, stdout, stderr) => {
			stderr.should.eql("");
			stdout.should.eql("");
			done();
		});
	});
});
