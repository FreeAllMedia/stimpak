import Stimpak from "../../lib/stimpak/stimpak.js";

describe("stimpak.generate()", () => {
	let stimpak,
			command,
			actualReport,
			templatesDirectoryPath;

	beforeEach(done => {
		stimpak = new Stimpak();

		command = "echo 'Hello, World!'";

		templatesDirectoryPath = `${__dirname}/fixtures/simpleTemplates`;

		stimpak
		.test
		.answers({
			fileName: "shapes",
			folderName: "letters",
			functionName: "foo"
		})
		.source("**/*", templatesDirectoryPath)
		.command(command)
		.generate((error, report) => {
			actualReport = report;
			done(error);
		});
	});

	it("should return with a report of all actions performed", () => {
		const expectedReport = {
			events: [
				{
					type: "directoryWrite",
					path: `${stimpak.destination()}/${stimpak.answers().dynamicFolderName}`,
					templatePath: `${templatesDirectoryPath}/##dynamicFolderName##`
				},
				{
					type: "fileWrite",
					path: `${stimpak.destination()}/${stimpak.answers().dynamicFolderName}/${stimpak.answers().dynamicFileName}.js`,
					templatePath: `${templatesDirectoryPath}/##dynamicFolderName##/##dynamicFileName##.js`,
					content: "export default function foo() {}"
				},
				{
					type: "command",
					command: command,
					stdout: "Hello, World!",
					stderr: ""
				}
			]
		};

		actualReport.should.eql(expectedReport);
	});
});
