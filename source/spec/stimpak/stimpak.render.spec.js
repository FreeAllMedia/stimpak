import Stimpak, { Source } from "../../lib/stimpak/stimpak.js";

describe("stimpak.render()", () => {
	let stimpak,
			globString,
			templatesDirectoryPath;

	beforeEach(() => {
		stimpak = new Stimpak();
		stimpak
			.test
			.answers({
				folderName: "shapes",
				fileName: "colors",
				functionName: "foo"
			});

		globString = "**/*";
		templatesDirectoryPath = `${__dirname}/fixtures/simpleTemplates`;
	});

	it("should return an instance of Source", () => {
		stimpak.render(globString).should.be.instanceOf(Source);
	});

	it("should add new instances to .sources", () => {
		const source = stimpak.render(globString);
		stimpak.sources.should.eql([source]);
	});

	it("should be able to set the directory at the same time", () => {
		const source = stimpak.render(globString, templatesDirectoryPath);
		source.directory().should.eql(templatesDirectoryPath);
	});

	it("should render sources in order", done => {
		let actualFilepaths;

		stimpak
		.render(globString, templatesDirectoryPath)
		.then(() => {
			actualFilepaths = Object.keys(stimpak.report.files);
		})
		.render(globString, `${__dirname}/fixtures/simpleExisting`)
		.generate(error => {
			actualFilepaths.should.eql([
				`${stimpak.destination()}/shapes`,
				`${stimpak.destination()}/shapes/colors.js`,
				`${stimpak.destination()}/textures.js`
			]);
			done(error);
		});
	});

	it("should bubble up thrown errors from the template system", done => {
		new Stimpak()
		.test
		.render(globString, `${__dirname}/fixtures/errorTemplates`)
		.generate(error => {
			error.should.be.instanceOf(Error);
			done();
		});
	});

	it("should include the template filepath along with the error thrown from the template system", done => {
		new Stimpak()
		.test
		.render(globString, templatesDirectoryPath)
		.generate(error => {
			error.message.should.eql(`"functionName" is not defined in "${templatesDirectoryPath}/##folderName##/##fileName##.js"`);
			done();
		});
	});
});
