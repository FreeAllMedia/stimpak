import Stimpak from "../../lib/stimpak/stimpak.js";
import glob from "glob";

describe(".skip(globOrGlobs)", () => {
	let stimpak,
			destinationPath;

	beforeEach(() => {
		stimpak = new Stimpak().test;

		destinationPath = stimpak.destination();

		stimpak
			.answers({
				dynamicFileName: "someFile",
				className: "SomeClass",
				dynamicFolderName: "someFolder",
				primaryFunctionName: "someFunction"
			})
			.render("**/*", `${__dirname}/fixtures/templates`);
	});

	it("should skip files that match a relative glob path", done => {
		stimpak
			.skip("**/!(colors.js)")
			.generate(error => {
				const generatedFileNames = glob.sync("**/*", {
					cwd: destinationPath,
					dot: true
				});

				generatedFileNames.should.eql([
					"colors.js"
				]);

				done(error);
			});
	});

	it("should skip files that match an absolute glob path", done => {
		stimpak
			.skip(`${stimpak.destination()}/**/!(colors.js)`)
			.generate(error => {
				const generatedFileNames = glob.sync("**/*", {
					cwd: destinationPath,
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
					cwd: destinationPath,
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
					cwd: destinationPath,
					dot: true
				});

				generatedFileNames.should.eql([
					"colors.js"
				]);

				done(error);
			});
	});
});
