import fileSystem from "fs-extra";
import path from "path";
import { exec as runCommand } from "child_process";
import { setupCliEnvironment } from "./stimpak.cli.helper.js";

describe("(CLI) stimpak generators", () => {
	let command,
			userProjectDirectoryPath;

	beforeEach(() => {
		const options = setupCliEnvironment();
		command = options.command;
		userProjectDirectoryPath = options.userProjectDirectoryPath;
	});

	it("should throw an error if any of the generators aren't installed", done => {
		const invalidGeneratorName = "not-a-real-generator";
		command += ` ${invalidGeneratorName}`;

		runCommand(command, (error, stdout, stderr) => {
			const expectedStderr = `"${invalidGeneratorName}" is not installed. Use "npm install stimpak-${invalidGeneratorName} -g"\n`;
			stderr.should.eql(expectedStderr);
			done();
		});
	});

	it("should use the current working directory as the destination", done => {
		command += " test-1";
		const expectedFilePath = `${userProjectDirectoryPath}/generated1.js`;

		runCommand(command, { cwd: userProjectDirectoryPath }, error => {
			fileSystem.existsSync(expectedFilePath).should.be.true;
			done(error);
		});
	});

	it("should print out the rendered done template on completion", done => {
		command += " test-1";

		const doneFileTemplatePath = path.normalize(
			`${__dirname}/../../lib/cli/templates/done.txt`
		);

		const expectedStdout = fileSystem.readFileSync(
			doneFileTemplatePath,
			{ encoding: "utf-8" }
		);

		runCommand(command, { cwd: userProjectDirectoryPath }, (error, stdout) => {
			stdout.should.eql(expectedStdout);
			done(error);
		});
	});

	it("should run multiple designated generators", done => {
		command += " test-1 test-2";

		const expectedFilePath = `${userProjectDirectoryPath}/generated2.js`;

		runCommand(command, { cwd: userProjectDirectoryPath }, error => {
			fileSystem.existsSync(expectedFilePath).should.be.true;
			done(error);
		});
	});

	it("should throw an error returned by .generate", done => {
		command += " test-3";

		runCommand(command, { cwd: userProjectDirectoryPath }, error => {
			error.message.should.contain("Generator 3 Error!");
			done();
		});
	});
});
