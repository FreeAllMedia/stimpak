import fileSystem from "fs";
import path from "path";
import { exec } from "child_process";
import temp from "temp";

describe("(CLI) stimpak generators", () => {
	let command,
			temporaryDirectoryPath;

	beforeEach(() => {
		temporaryDirectoryPath = temp.mkdirSync("stimpak generators");

		const stimpakPath = path.normalize(`${__dirname}/../../../es5/lib/cli/stimpak.cli.js`);
		command = `node ${stimpakPath}`;
	});

	it("should throw an error if any of the generators aren't installed", done => {
		const invalidGeneratorName = "not-a-real-generator";
		command += ` ${invalidGeneratorName}`;

		exec(command, (error, stdout, stderr) => {
			const expectedStderr = `"${invalidGeneratorName}" is not installed. Use "npm install stimpak-${invalidGeneratorName} -g"`;
			stderr.should.eql(expectedStderr);
			done();
		});
	});

	it("should call the designated generators by name", done => {
		command += " test-1";

		const expectedStdout = "Stimpak";

		exec(command, { cwd: temporaryDirectoryPath }, (error, stdout) => {
			stdout.should.eql(expectedStdout);
			done(error);
		});
	});

	it("should use the current working directory as the destination", done => {
		command += ` ${__dirname}/fixtures/generator.js`;
		const expectedFilePath = `${temporaryDirectoryPath}/generated.js`;

		exec(command, { cwd: temporaryDirectoryPath }, error => {
			fileSystem.existsSync(expectedFilePath).should.be.true;
			done(error);
		});
	});

	it("should print out when it's done");
	it("should run multiple designated generators");
	it("should throw an error returned by .generate");
});
