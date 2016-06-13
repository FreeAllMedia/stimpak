import {
	exec as runCommand
} from "child_process";

import { setupCliEnvironment, cleanEnvironment } from "./stimpak.cli.helper.js";

describe("(CLI) stimpak sub-generators", function () {
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

	it("should transpile symlinked subgenerators", function (done) {
		command += " test-5 --promptName=Blah";

		runCommand(command, { cwd: temporaryDirectoryPath }, (error, stdout, stderr) => {
			stderr.should.be.empty;
			done(error);
		});
	});

	it("should be able to transpile global subgenerators", function (done) {
		command += " 00000 --promptName=Blah";

		runCommand(command, { cwd: temporaryDirectoryPath }, (error, stdout, stderr) => {
			const allOutput = stdout + stderr;
			allOutput.should.not.contain("export default class StimpakSubGenerator");
			done(error);
		});
	});
});
