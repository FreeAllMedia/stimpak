import Stimpak from "../../lib/stimpak/stimpak.js";
import sinon from "sinon";
import File from "vinyl";
import fileSystem from "fs-extra";
import path from "path";
import temp from "temp";
import newTemplate from "lodash.template";
import glob from "glob";

describe("stimpak.merge() (on .generate)", () => {
	let stimpak,
			mergeStrategy,
			templateDirectoryPath,
			temporaryDirectoryPath,
			results,
			existingProjectPath,
			existingFileName,
			existingFilePath,
			existingFileContents,
			mergedFileContents,
			answers;

	beforeEach(done => {
		templateDirectoryPath = path.normalize(`${__dirname}/fixtures/templates/`);
		temporaryDirectoryPath = temp.mkdirSync("stimpak.merge");
		existingProjectPath = path.normalize(`${__dirname}/fixtures/existingProject/`);

		fileSystem.copySync(existingProjectPath, temporaryDirectoryPath);

		results = {};

		mergedFileContents = "merged!";

		mergeStrategy = sinon.spy((generator, newFile, oldFile, mergeCallback) => {
			results.generator = generator;
			results.newFile = newFile;
			results.oldFile = oldFile;

			results.mergedFile = new File({
				cwd: results.newFile.cwd,
				base: results.newFile.base,
				path: results.newFile.path,
				contents: new Buffer(mergedFileContents)
			});

			mergeCallback(null, results.mergedFile);
		});

		existingFileName = "package.json";
		existingFilePath = `${temporaryDirectoryPath}/${existingFileName}`;
		existingFileContents = fileSystem.readFileSync(existingFilePath);

		answers = {
			className: "Foo",
			primaryFunctionName: "bar",
			dynamicFileName: "someName"
		};

		stimpak = new Stimpak();
		stimpak
			.answers(answers)
			.source("**.*")
				.directory(templateDirectoryPath)
			.destination(temporaryDirectoryPath)
			.merge(
				existingFileName,
				mergeStrategy
			)
			.generate(done);
	});

	it("should call the mergeStrategy with the generator", () => {
		results.generator.should.eql(stimpak);
	});

	it("should call the mergeStrategy with the new file as a vinyl object", () => {
		File.isVinyl(results.newFile).should.be.true;
	});

	it("should set the new file to the appropriate file path", () => {
		const filePath = results.newFile.path;
		filePath.should.be.eql(existingFilePath);
	});

	it("should set the new file to the appropriate base path", () => {
		const base = results.newFile.base;
		base.should.be.eql(temporaryDirectoryPath);
	});

	it("should set the new file to the appropriate file contents", () => {
		const templateContents = fileSystem.readFileSync(`${templateDirectoryPath}/${existingFileName}`, { encoding: "utf-8" });
		const template = newTemplate(templateContents);
		const expectedFileContents = template(stimpak.answers());

		const actualFileContents = results.newFile.contents.toString();
		actualFileContents.should.be.eql(expectedFileContents);
	});

	it("should call the mergeStrategy with the old file as a vinyl object", () => {
		File.isVinyl(results.oldFile).should.be.true;
	});

	it("should set the old file to the appropriate file path", () => {
		const filePath = results.oldFile.path;
		filePath.should.be.eql(existingFilePath);
	});

	it("should set the old file to the appropriate base", () => {
		const base = results.oldFile.base;
		base.should.be.eql(temporaryDirectoryPath);
	});

	it("should set the old file to the appropriate file contents", () => {
		const expectedFileContents = existingFileContents.toString();
		const actualFileContents = results.oldFile.contents.toString();
		actualFileContents.should.be.eql(expectedFileContents);
	});

	it("should overwrite existing files that don't have a merge strategy", () => {
		const templateContents = fileSystem.readFileSync(`${templateDirectoryPath}/colors.js`, { encoding: "utf-8" });
		const template = newTemplate(templateContents);
		const expectedFileContents = template(stimpak.answers());

		const actualFileContents = fileSystem.readFileSync(`${temporaryDirectoryPath}/colors.js`, { encoding: "utf-8" });

		actualFileContents.should.eql(expectedFileContents);
	});

	it("should render existing files like normal if there are no merge strategies at all", done => {
		const templateContents = fileSystem.readFileSync(`${templateDirectoryPath}/colors.js`, { encoding: "utf-8" });
		const template = newTemplate(templateContents);
		const expectedFileContents = template(stimpak.answers());

		stimpak = new Stimpak();

		stimpak
			.answers(answers)
			.source("**.*")
				.directory(templateDirectoryPath)
			.destination(temporaryDirectoryPath)
			.generate(() => {
				const actualFileContents = fileSystem.readFileSync(`${temporaryDirectoryPath}/colors.js`, { encoding: "utf-8" });
				actualFileContents.should.eql(expectedFileContents);
				done();
			});
	});

	it("should write the file returned by the merge function callback", () => {
		const expectedFileContents = mergedFileContents;

		stimpak = new Stimpak();

		const actualFileContents = fileSystem.readFileSync(`${temporaryDirectoryPath}/${existingFileName}`, { encoding: "utf-8" });
		actualFileContents.should.eql(expectedFileContents);
	});

	it("should return an error if a merge function returns an error", done => {
		const expectedErrorMessage = "Something went wrong!";

		stimpak = new Stimpak();

		stimpak
			.answers(answers)
			.source("**.*")
				.directory(templateDirectoryPath)
			.destination(temporaryDirectoryPath)
			.merge(existingFilePath, (generator, newFile, oldFile, mergeCallback) => {
				mergeCallback(new Error(expectedErrorMessage));
			})
			.generate(error => {
				error.message.should.eql(expectedErrorMessage);
				done();
			});
	});

	it("should handle multiple merge strategies", done => {
		stimpak = new Stimpak();

		function mergeFunction(generator, newFile, oldFile, mergeCallback) {
			mergeCallback(null, oldFile);
		}

		stimpak
			.answers(answers)
			.source("**.*")
				.directory(templateDirectoryPath)
			.destination(temporaryDirectoryPath)
			.merge(existingFilePath, mergeFunction)
			.merge(existingFilePath, mergeFunction)
			.generate(() => {
				done();
			});
	});
});
