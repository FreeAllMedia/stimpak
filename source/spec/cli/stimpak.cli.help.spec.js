import fileSystem from "fs";
import path from "path";
import { exec } from "child_process";

describe("(CLI) stimpak", () => {
	let command,
			expectedStdout;

	beforeEach(() => {
		const helpFileTemplatePath = path.normalize(
			`${__dirname}/../../lib/cli/templates/help.txt`
		);

		expectedStdout = fileSystem.readFileSync(
			helpFileTemplatePath,
			{ encoding: "utf-8" }
		);

		const stimpakPath = "./es5/lib/cli/stimpak.cli.js";
		command = `node ${stimpakPath}`;
	});

	it("should return the help page when called without arguments", done => {
		exec(command, (error, stdout) => {
			stdout.should.eql(expectedStdout);
			done(error);
		});
	});

	it("should return the help page when called with the -h flag", done => {
		command += " -h";
		exec(command, (error, stdout) => {
			stdout.should.eql(expectedStdout);
			done(error);
		});
	});

	it("should return the help page when called with the --help flag as the first argument", done => {
		command += " --help";
		exec(command, (error, stdout) => {
			stdout.should.eql(expectedStdout);
			done(error);
		});
	});
});
