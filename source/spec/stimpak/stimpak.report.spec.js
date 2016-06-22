import Stimpak from "../../lib/stimpak/stimpak.js";
import fileSystem from "fs-extra";

describe("stimpak.report()", () => {
	let stimpak,
			command,
			actualReport,
			templatesDirectoryPath;

	beforeEach(done => {
		stimpak = new Stimpak();

		command = "echo 'Hello, World!'";

		templatesDirectoryPath = `${__dirname}/fixtures/simpleTemplates`;

		stimpak.test;

		fileSystem.copySync(`${__dirname}/fixtures/simpleExisting`, stimpak.destination());

		stimpak
		.answers({
			fileName: "shapes",
			folderName: "letters",
			functionName: "foo"
		})
		.render("**/*", templatesDirectoryPath)
		.merge("letters/shapes.js", (self, newFile, oldFile, mergeDone) => {
			newFile.stem = "blah";
			mergeDone(null, newFile);
		})
		.command(command)
		.generate(error => {
			actualReport = stimpak.report;
			done(error);
		});
	});

	it("should be a read-only property", () => {
		(() => {
			stimpak.report = {};
		}).should.throw();
	});

	it("should return with a report of all system-altering events performed", () => {
		const expectedEvents = [
			{
				type: "writeDirectory",
				path: `${stimpak.destination()}/letters`,
				templatePath: `${templatesDirectoryPath}/##folderName##`
			},
			{
				type: "mergeFile",
				path: `${stimpak.destination()}/letters/blah.js`,
				oldPath: `${stimpak.destination()}/letters/shapes.js`,
				templatePath: `${templatesDirectoryPath}/##folderName##/##fileName##.js`,
				content: "export default function foo() {}\n",
				oldContent: "export default function baz() {}\n"
			},
			{
				type: "writeFile",
				path: `${stimpak.destination()}/textures.js`,
				templatePath: `${templatesDirectoryPath}/textures.js`,
				content: "Flub!\n"
			},
			{
				type: "command",
				command: command,
				stdout: "Hello, World!\n",
				stderr: ""
			}
		];

		console.log(actualReport.events);

		actualReport.events.should.eql(expectedEvents);
	});

	it("should return with a list of all files affected", () => {
		const expectedFiles = {
			[`${stimpak.destination()}/letters/blah.js`]: {
				isDirectory: false,
				isMerged: true,
				path: `${stimpak.destination()}/letters/blah.js`,
				oldPath: `${stimpak.destination()}/letters/shapes.js`,
				templatePath: `${templatesDirectoryPath}/##folderName##/##fileName##.js`,
				content: "export default function foo() {}\n",
				oldContent: "export default function baz() {}\n"
			},
			[`${stimpak.destination()}/letters`]: {
				isDirectory: true,
				isMerged: false,
				path: `${stimpak.destination()}/letters`,
				templatePath: `${templatesDirectoryPath}/##folderName##`
			},
			[`${stimpak.destination()}/textures.js`]: {
				isDirectory: false,
				isMerged: false,
				path: `${stimpak.destination()}/textures.js`,
				templatePath: `${templatesDirectoryPath}/textures.js`,
				content: "Flub!\n"
			}
		};

		actualReport.files.should.eql(expectedFiles);
	});
});
