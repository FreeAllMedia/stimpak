import { exec as runCommand } from "child_process";
import { setupCliEnvironment } from "./stimpak.cli.helper.js";

describe("(CLI) stimpak --answers", function () {
	this.timeout(10000);

	let command,
			temporaryDirectoryPath;

	beforeEach(() => {
		const options = setupCliEnvironment();
		command = options.command;
		temporaryDirectoryPath = options.temporaryDirectoryPath;
	});

	it("should use provided answer and skip question prompt", done => {
		command += " test-1 --promptName=Blah";
		runCommand(command, { cwd: temporaryDirectoryPath }, (error, stdout) => {
			try {
				stdout.should.eql("DONE!\n");
				done();
			} catch (err) {
				done(err);
			}
		});
	});

	it("should use report malformed answers", done => {
		command += " test-4 --promptName=Blah --malformed1:Blah --malformed2";
		runCommand(command, { cwd: temporaryDirectoryPath }, (error, stdout, stderr) => {
			try {
				stderr.should.match(/The provided answer "--malformed1:Blah" is malformed.*\nThe provided answer "--malformed2" is malformed/);
				done();
			} catch (err) {
				done(err);
			}
		});
	});
});
