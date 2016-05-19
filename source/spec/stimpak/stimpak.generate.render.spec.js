import Stimpak from "../../lib/stimpak/stimpak.js";
import sinon from "sinon";
import temp from "temp";
import path from "path";
import glob from "glob";
import newTemplate from "lodash.template";
import fileSystem from "fs";

describe("stimpak.generate() (template rendering)", () => {
	let stimpak,
			temporaryDirectoryPath,
			templateDirectoryPath,
			sourceGlob,
			templateFilePaths,
			renderedFilePaths,
			generatedFilePaths;

	beforeEach(done => {
		stimpak = new Stimpak();

		temporaryDirectoryPath = temp.mkdirSync("stimpak.generate");
		templateDirectoryPath = path.normalize(`${__dirname}/fixtures/templates`);

		templateFilePaths = glob.sync("**/*", { cwd: templateDirectoryPath });
		renderedFilePaths = templateFilePaths.map(templateFilePath => {
			return templateFilePath
				.replace("##dynamicFileName##", "shapes")
				.replace("##dynamicFolderName##", "letters");
		});

		stimpak
			.answers({
				dynamicFileName: "shapes",
				dynamicFolderName: "letters",
				className: "Foo",
				primaryFunctionName: "index"
			})
			.source(sourceGlob)
				.directory(templateDirectoryPath)
			.destination(temporaryDirectoryPath)
			.generate(() => {
				generatedFilePaths = glob.sync("**/*", { cwd: temporaryDirectoryPath });
				done();
			});
	});

	it("should render templates to a destination directory", () => {
		generatedFilePaths.should.have.members(renderedFilePaths);
	});

	it("should render templates with .answers as template values", () => {
		const templateFileContents = fileSystem.readFileSync(`${templateDirectoryPath}/colors.js`, { encoding: "utf-8" });
		const template = newTemplate(templateFileContents);
		const expectedRenderedTemplate = template(stimpak.answers());

		const actualRenderedTemplate = fileSystem.readFileSync(`${temporaryDirectoryPath}/colors.js`, { encoding: "utf-8" });

		actualRenderedTemplate.should.eql(expectedRenderedTemplate);
	});

	it("should return an error if destination is not set", done => {
		stimpak = new Stimpak();
		stimpak
			.generate(error => {
				error.message.should.eql("You must set .destination() before you can .generate()");
				done();
			});
	});
});
