import Stimpak from "../../lib/stimpak/stimpak.js";
import sinon from "sinon";
import File from "vinyl";
import fileSystem from "fs-extra";
import path from "path";
import temp from "temp";
import newTemplate from "lodash.template";

describe("stimpak.merge() (on .generate)", () => {
	let stimpak,
			mergeStrategy,
			templateDirectoryPath,
			temporaryDirectoryPath,
			results,
			existingProjectPath,
			existingFileName,
			existingFilePath;

	beforeEach(done => {
		templateDirectoryPath = path.normalize(`${__dirname}/fixtures/templates/`);
		temporaryDirectoryPath = temp.mkdirSync("stimpak.merge");
		existingProjectPath = path.normalize(`${__dirname}/fixtures/existingProject/`);

		fileSystem.copySync(existingProjectPath, temporaryDirectoryPath);

		results = {};

		mergeStrategy = sinon.spy((generator, newFile, oldFile, strategyCallback) => {
			results.generator = generator;
			results.newFile = newFile;
			results.oldFile = oldFile;

			strategyCallback(null, oldFile);
		});

		existingFileName = "package.json";
		existingFilePath = `${temporaryDirectoryPath}/${existingFileName}`;

		stimpak = new Stimpak();
		stimpak
			.answers({
				className: "Foo",
				primaryFunctionName: "bar"
			})
			.source("+(package|colors).*")
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
		const expectedFileContents = fileSystem.readFileSync(existingFilePath, { encoding: "utf-8" });
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
});
