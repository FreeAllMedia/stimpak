import Stimpak from "../../lib/stimpak/stimpak.js";
import glob from "glob";
import temp from "temp";

describe(".skip(globOrGlobs)", () => {
	let stimpak,
			temporaryDirectoryPath;

	beforeEach(() => {
		stimpak = new Stimpak();
		temporaryDirectoryPath = temp.mkdirSync("stimpak.skip");

		stimpak
			.answers({
				dynamicFileName: "someFile",
				className: "SomeClass",
				dynamicFolderName: "someFolder",
				primaryFunctionName: "someFunction"
			})
			.destination(temporaryDirectoryPath)
			.source("**/*")
				.directory(`${__dirname}/fixtures/templates`);
	});

	it("should skip files that match the provided globs", done => {
		stimpak
			.skip("**/!(colors.js)")
			.generate(error => {
				const generatedFileNames = glob.sync("**/*", {
					cwd: temporaryDirectoryPath,
					dot: true
				});

				generatedFileNames.should.eql([
					"colors.js"
				]);

				done(error);
			});
	});

	it("should skip files by destination file name", done => {
		stimpak
			.skip([
				"**/package.json",
				"**/.someFile",
				"**/{existingDirectory,existingDirectory/**/*}",
				"**/{someFolder,someFolder/**/*}"
			])
			.generate(error => {
				const generatedFileNames = glob.sync("**/*", {
					cwd: temporaryDirectoryPath,
					dot: true
				});

				generatedFileNames.should.eql([
					"colors.js"
				]);

				done(error);
			});
	});

	it("should skip files by template name", done => {
		stimpak
			.skip([
				"**/package.json",
				"**/.##dynamicFileName##",
				"**/{existingDirectory,existingDirectory/**/*}",
				"**/{##dynamicFolderName##,##dynamicFolderName##/**/*}"
			])
			.generate(error => {
				const generatedFileNames = glob.sync("**/*", {
					cwd: temporaryDirectoryPath,
					dot: true
				});

				generatedFileNames.should.eql([
					"colors.js"
				]);

				done(error);
			});
	});
});
