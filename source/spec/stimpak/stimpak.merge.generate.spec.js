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
			existingFilePath,
			existingFileContents,
			mergedFileContents,
			basePath,
			answers;

	beforeEach(done => {
		templateDirectoryPath = path.normalize(`${__dirname}/fixtures/templates/`);
		temporaryDirectoryPath = temp.mkdirSync("stimpak.merge");
		existingProjectPath = path.normalize(`${__dirname}/fixtures/existingProject/`);
		basePath = `${temporaryDirectoryPath}/`;

		fileSystem.copySync(existingProjectPath, temporaryDirectoryPath);

		results = {};

		mergedFileContents = "merged!";

		mergeStrategy = sinon.spy((generator, oldFile, newFile, mergeCallback) => {
			results.generator = generator;
			results.newFile = newFile;
			results.oldFile = oldFile;

			results.mergedFile = Object.assign({}, newFile);
			results.mergedFile.contents = mergedFileContents;

			mergeCallback(null, results.mergedFile);
		});

		existingFileName = "package.json";
		existingFilePath = `${temporaryDirectoryPath}/${existingFileName}`;
		existingFileContents = fileSystem.readFileSync(existingFilePath, "utf8");

		answers = {
			className: "Foo",
			primaryFunctionName: "bar",
			dynamicFileName: "someName"
		};

		stimpak = new Stimpak();
		stimpak
			.answers(answers)
			.render("**/*", templateDirectoryPath)
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

	it("should call the mergeStrategy with the new file as a virtual file object", () => {
		const templateContents = fileSystem.readFileSync(`${templateDirectoryPath}/${existingFileName}`, "utf-8");
		const template = newTemplate(templateContents);
		const expectedFileContents = template(stimpak.answers());

		results.newFile.should.eql({
			name: existingFileName,
			base: basePath,
			path: existingFilePath,
			contents: expectedFileContents,
			isFile: true,
			isDirectory: false,
			isMerged: false
		});
	});

	it("should call the mergeStrategy with the old file as a virtual file object", () => {
		results.oldFile.should.eql({
			name: existingFileName,
			base: basePath,
			path: existingFilePath,
			contents: existingFileContents,
			isFile: true,
			isDirectory: false,
			isMerged: false
		});
	});

	it("should overwrite existing files that don't have a merge strategy", () => {
		const templateContents = fileSystem.readFileSync(`${templateDirectoryPath}/colors.js`, "utf-8");
		const template = newTemplate(templateContents);
		const expectedFileContents = template(stimpak.answers());

		const actualFileContents = fileSystem.readFileSync(`${temporaryDirectoryPath}/colors.js`, "utf-8");

		actualFileContents.should.eql(expectedFileContents);
	});

	it("should render existing files like normal if there are no merge strategies at all", done => {
		const templateContents = fileSystem.readFileSync(`${templateDirectoryPath}/colors.js`, "utf-8");
		const template = newTemplate(templateContents);
		const expectedFileContents = template(stimpak.answers());

		stimpak = new Stimpak();

		stimpak
			.answers(answers)
			.render("**/*", templateDirectoryPath)
			.destination(temporaryDirectoryPath)
			.generate(() => {
				const actualFileContents = fileSystem.readFileSync(`${temporaryDirectoryPath}/colors.js`, "utf-8");
				actualFileContents.should.eql(expectedFileContents);
				done();
			});
	});

	it("should write the file returned by the merge function callback", () => {
		const expectedFileContents = mergedFileContents;

		stimpak = new Stimpak();

		const actualFileContents = fileSystem.readFileSync(`${temporaryDirectoryPath}/${existingFileName}`, "utf-8");
		actualFileContents.should.eql(expectedFileContents);
	});

	it("should return an error if a merge function returns an error", done => {
		const expectedErrorMessage = "Something went wrong!";

		stimpak = new Stimpak();

		stimpak
			.answers(answers)
			.render("**/*", templateDirectoryPath)
			.destination(temporaryDirectoryPath)
			.merge(existingFileName, (generator, oldFile, newFile, mergeCallback) => {
				mergeCallback(new Error(expectedErrorMessage));
			})
			.generate(error => {
				error.message.should.eql(expectedErrorMessage);
				done();
			});
	});

	it("should handle multiple merge strategies", done => {
		stimpak = new Stimpak();

		function mergeFunction(generator, oldFile, newFile, mergeCallback) {
			mergeCallback(null, oldFile);
		}

		stimpak
			.answers(answers)
			.render("**/*", templateDirectoryPath)
			.destination(temporaryDirectoryPath)
			.merge(existingFilePath, mergeFunction)
			.merge(existingFilePath, mergeFunction)
			.generate(() => {
				done();
			});
	});
});
