import fileSystem from "fs-extra";
import path from "path";

import {
	exec as runCommand
} from "child_process";

import { setupCliEnvironment } from "./stimpak.cli.helper.js";
import glob from "glob";

describe("(CLI) stimpak generators", function () {
	this.timeout(10000);

	let command,
			temporaryDirectoryPath,
			options;

	before(() => {
		options = setupCliEnvironment();
		temporaryDirectoryPath = options.temporaryDirectoryPath;
	});

	beforeEach(() => {
		command = String(options.command);
	});

	it("should throw an error if any of the generators aren't installed", done => {
		const invalidGeneratorName = "not-a-real-generator";
		command += ` ${invalidGeneratorName}`;

		runCommand(command, { cwd: temporaryDirectoryPath }, (error, stdout, stderr) => {
			const expectedStderr = `"${invalidGeneratorName}" is not installed. Use "npm install stimpak-${invalidGeneratorName} -g"\n`;
			stderr.should.eql(expectedStderr);
			done();
		});
	});

	it("should use the current working directory as the destination", done => {
		command += " test-1 --promptName=Blah";
		const expectedFilePath = `${temporaryDirectoryPath}/generated.js`;

		runCommand(command, { cwd: temporaryDirectoryPath }, error => {
			fileSystem.existsSync(expectedFilePath).should.be.true;
			done(error);
		});
	});

	it("should print out the rendered done template on completion", done => {
		command += " test-1 --promptName=Blah";

		const doneFileTemplatePath = path.normalize(
			`${__dirname}/../../lib/cli/templates/done.txt`
		);

		const expectedStdout = fileSystem.readFileSync(
			doneFileTemplatePath,
			{ encoding: "utf-8" }
		);

		runCommand(command, { cwd: temporaryDirectoryPath }, (error, stdout) => {
			stdout.should.eql(expectedStdout);
			done(error);
		});
	});

	it("should run multiple designated generators", done => {
		command += " test-1 test-2 --promptName=Blah";

		const expectedFilePaths = [
			`${temporaryDirectoryPath}/generated.js`,
			`${temporaryDirectoryPath}/generated2.js`
		];

		runCommand(command, { cwd: temporaryDirectoryPath }, error => {
			const actualFilePaths = glob.sync(`${temporaryDirectoryPath}/*.js`);
			actualFilePaths.should.have.members(expectedFilePaths);
			done(error);
		});
	});

	it("should throw an error returned by .generate", done => {
		command += " test-3";

		runCommand(command, { cwd: temporaryDirectoryPath }, error => {
			try {
				error.message.should.contain("Generator 3 Error!");
				done();
			} catch (caughtError) {
				done(caughtError);
			}
		});
	});

	it("should be able to require global generators", function (done) {
		command += " 00000 --promptName=Blah";

		runCommand(command, { cwd: temporaryDirectoryPath }, (error, stdout, stderr) => {
			stderr.should.not.contain("SyntaxError: Unexpected reserved word");
			done();
		});
	});
});
