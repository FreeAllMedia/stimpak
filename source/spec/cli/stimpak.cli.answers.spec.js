import fileSystem from "fs-extra";
import path from "path";
import { exec as runCommand } from "child_process";
import temp from "temp";

describe("(CLI) stimpak --answers", () => {
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
		const generatorFourDirectoryPath =
			`${stimpakDirectoryPath}/node_modules/stimpak-test-4`;

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
		try {
			fileSystem.unlinkSync(generatorFourDirectoryPath);
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

		fileSystem.symlinkSync(
			`${nodeModulesFixtureDirectoryPath}/stimpak-test-4`,
			generatorFourDirectoryPath
		);

		command = `node ${stimpakCliPath}`;
	});

	it("should use provided answer and skip question prompt", done => {
		command += " test-4 --promptName=Blah";
		runCommand(command, (error, stdout, stderr) => {
			try {
				stderr.should.eql("");
				stdout.should.eql("DONE!\n");
				done();
			} catch (err) {
				done(err);
			}
		});
	});

	it("should use report malformed answers", done => {
		command += " test-4 --promptName=Blah --malformed1:Blah --malformed2";
		runCommand(command, (error, stdout, stderr) => {
			try {
				stderr.should.contain("The provided answer \"--malformed1:Blah\" is malformed");
				stderr.should.contain("The provided answer \"--malformed2\" is malformed");
				stdout.should.eql("DONE!\n");
				done();
			} catch (err) {
				done(err);
			}
		});
	});
});
