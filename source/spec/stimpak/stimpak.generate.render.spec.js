import Stimpak from "../../lib/stimpak/stimpak.js";
import temp from "temp";
import path from "path";
import glob from "glob";
import newTemplate from "lodash.template";
import fileSystem from "fs-extra";

describe("stimpak.generate() (template rendering)", () => {
	let stimpak,
			temporaryDirectoryPath,
			templateDirectoryPath,
			sourceGlob,
			templateFilePaths,
			expectedGeneratedFilePaths,
			actualGeneratedFilePaths,
			existingFileNames,
			answers;

	beforeEach(() => {
		stimpak = new Stimpak();

		temporaryDirectoryPath = temp.mkdirSync("stimpak.generate");

		const existingProjectPath = path.normalize(`${__dirname}/fixtures/existingProject/`);
		fileSystem.copySync(existingProjectPath, temporaryDirectoryPath);

		existingFileNames = glob.sync("**/*", { cwd: temporaryDirectoryPath, dot: true });

		templateDirectoryPath = path.normalize(`${__dirname}/fixtures/templates`);

		templateFilePaths = glob.sync("**/*", { cwd: templateDirectoryPath, dot: true });
		expectedGeneratedFilePaths = templateFilePaths.map(templateFilePath => {
			return templateFilePath
				.replace("##dynamicFileName##", "shapes")
				.replace("##dynamicFolderName##", "letters");
		});

		answers = {
			dynamicFileName: "shapes",
			dynamicFolderName: "letters",
			className: "Foo",
			primaryFunctionName: "index"
		};

		actualGeneratedFilePaths = [];

		stimpak
			.answers(answers)
			.render(sourceGlob, templateDirectoryPath)
			.destination(temporaryDirectoryPath);
	});

	describe("(after generating)", () => {
		beforeEach(done => {
			stimpak
				.generate(() => {
					actualGeneratedFilePaths = glob.sync("**/*", { cwd: temporaryDirectoryPath, dot: true });
					done();
				});
		});

		it("should render templates to a destination directory", () => {
			actualGeneratedFilePaths.should.have.members(expectedGeneratedFilePaths);
		});

		it("should render templates with .answers as template values", () => {
			const templateFileContents = fileSystem.readFileSync(`${templateDirectoryPath}/colors.js`, { encoding: "utf-8" });
			const template = newTemplate(templateFileContents);

			const expectedRenderedTemplate = template(stimpak.answers());

			const actualRenderedTemplate = fileSystem.readFileSync(`${temporaryDirectoryPath}/colors.js`, { encoding: "utf-8" });

			actualRenderedTemplate.should.eql(expectedRenderedTemplate);
		});

		it("should return an error if destination is not set and .render is called", done => {
			stimpak = new Stimpak();
			stimpak
				.generate(error => {
					error.message.should.eql("You must set .destination() before you can .generate()");
					done();
				});
		});

		it("should generate .dotfiles", () => {
			actualGeneratedFilePaths.should.contain(`.${answers.dynamicFileName}`);
		});
	});
});
