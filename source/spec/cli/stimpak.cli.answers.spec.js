import { exec as runCommand } from "child_process";
import { setupCliEnvironment } from "./stimpak.cli.helper.js";

describe("(CLI) stimpak --answers", function () {
	this.timeout(20000);

	let command,
			temporaryDirectoryPath,
			environmentOptions;

	before(done => {
		setupCliEnvironment((error, options) => {
			environmentOptions = options;
			done();
		});
	});

	beforeEach(() => {
		command = String(environmentOptions.command);
		temporaryDirectoryPath = String(environmentOptions.temporaryDirectoryPath);
	});

	it("should use provided answer and skip question prompt", done => {
		command += " test-1 --promptName=Blah";
		runCommand(command, { cwd: temporaryDirectoryPath }, error => {
			done(error);
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
