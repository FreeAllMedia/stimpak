import fileSystem from "fs-extra";
import path from "path";
import { exec as runCommand } from "child_process";
import temp from "temp";
import glob from "glob";

describe("(CLI) stimpak generators", () => {
	let command,
			temporaryDirectoryPath;

	beforeEach(() => {
		temporaryDirectoryPath = temp.mkdirSync("stimpakgenerators");

		const projectRootPath = path.normalize(
			`${__dirname}/../../../`
		);

		const es5DirectoryPath =
			`${projectRootPath}/es5`;
		const nodeModulesDirectoryPath =
			`${temporaryDirectoryPath}/node_modules`;
		const nodeModulesFixtureDirectoryPath =
			`${es5DirectoryPath}/spec/cli/fixtures/project/node_modules`;
		const stimpakDirectoryPath =
			`${nodeModulesDirectoryPath}/stimpak`;
		const stimpakCliPath =
			`${stimpakDirectoryPath}/es5/lib/cli/stimpak.cli.js`;
		const generatorOneDirectoryPath =
			`${stimpakDirectoryPath}/node_modules/stimpak-test-1`;
		const generatorTwoDirectoryPath =
			`${stimpakDirectoryPath}/node_modules/stimpak-test-2`;
		const generatorThreeDirectoryPath =
			`${stimpakDirectoryPath}/node_modules/stimpak-test-3`;

		fileSystem.mkdirSync(nodeModulesDirectoryPath);

		fileSystem.symlinkSync(
			projectRootPath,
			stimpakDirectoryPath
		);

		try {
			fileSystem.unlinkSync(generatorOneDirectoryPath);
		}	catch (error) {}
		try {
			fileSystem.unlinkSync(generatorTwoDirectoryPath);
		}	catch (error) {}
		try {
			fileSystem.unlinkSync(generatorThreeDirectoryPath);
		}	catch (error) {}

		fileSystem.symlinkSync(
			`${nodeModulesFixtureDirectoryPath}/stimpak-test-1`,
			generatorOneDirectoryPath
		);

		fileSystem.symlinkSync(
			`${nodeModulesFixtureDirectoryPath}/stimpak-test-2`,
			generatorTwoDirectoryPath
		);

		fileSystem.symlinkSync(
			`${nodeModulesFixtureDirectoryPath}/stimpak-test-3`,
			generatorThreeDirectoryPath
		);

		command = `node ${stimpakCliPath}`;
	});

	it("should throw an error if any of the generators aren't installed", done => {
		const invalidGeneratorName = "not-a-real-generator";
		command += ` ${invalidGeneratorName}`;

		runCommand(command, (error, stdout, stderr) => {
			const expectedStderr = `"${invalidGeneratorName}" is not installed. Use "npm install stimpak-${invalidGeneratorName} -g"`;
			stderr.should.eql(expectedStderr);
			done();
		});
	});

	it("should use the current working directory as the destination", done => {
		command += " test-1";
		const expectedFilePath = `${temporaryDirectoryPath}/generated1.js`;

		runCommand(command, { cwd: temporaryDirectoryPath }, error => {
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

		runCommand(command, { cwd: temporaryDirectoryPath }, (error, stdout) => {
			stdout.should.eql(expectedStdout);
			done(error);
		});
	});

	it("should run multiple designated generators", done => {
		command += " test-1 test-2";

		const expectedFilePath = `${temporaryDirectoryPath}/generated2.js`;

		runCommand(command, { cwd: temporaryDirectoryPath }, error => {
			fileSystem.existsSync(expectedFilePath).should.be.true;
			done(error);
		});
	});

	it("should throw an error returned by .generate", done => {
		command += " test-3";

		runCommand(command, { cwd: temporaryDirectoryPath }, error => {
			error.message.should.contain("Generator 3 Error!");
			done();
		});
	});
});
