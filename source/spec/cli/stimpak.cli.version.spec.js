import { exec } from "child_process";

import packageJson from "../../../package.json";

describe("(CLI) stimpak --version", () => {
	let command,
			expectedStdout;

	beforeEach(() => {
		const stimpakPath = "./es5/lib/cli/stimpak.cli.js";
		command = `node ${stimpakPath}`;
		expectedStdout = `${packageJson.version}\n`;
	});

	it("should return the version number when called with the --version flag", done => {
		command += " --version";
		exec(command, (error, stdout) => {
			stdout.should.eql(expectedStdout);
			done(error);
		});
	});

	it("should return the version number when called with the -V flag", done => {
		command += " -V";
		exec(command, (error, stdout) => {
			stdout.should.eql(expectedStdout);
			done(error);
		});
	});
});
