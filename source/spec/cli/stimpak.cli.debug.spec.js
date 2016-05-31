import { exec } from "child_process";
import { setupCliEnvironment, cleanEnvironment } from "./stimpak.cli.helper.js";

describe("(CLI) stimpak --debug", function () {
	this.timeout(20000);

	let command,
			temporaryDirectoryPath,
			environmentOptions;

	beforeEach(done => {
		setupCliEnvironment((error, options) => {
			environmentOptions = options;
			temporaryDirectoryPath = environmentOptions.temporaryDirectoryPath;
			command = environmentOptions.command;
			done();
		});
	});

	afterEach(() => {
		cleanEnvironment();
	});

	it("should activate debug mode", done => {
		command += " test-1 --promptName=blah --debug";

		exec(command, { cwd: temporaryDirectoryPath }, (error, stdout) => {
			stdout.should.contain("STIMPAK DEBUG MODE");
			done(error);
		});
	});
});
