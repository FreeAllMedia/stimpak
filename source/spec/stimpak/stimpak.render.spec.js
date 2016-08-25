import Stimpak from "../../lib/stimpak/stimpak.js";

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

	it("should return this to enable chaining", () => {
		stimpak.render(globString, templatesDirectoryPath).should.eql(stimpak);
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
				`${stimpak.destination()}/textures.js`,
				`${stimpak.destination()}/shapes/colors.js`
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
			error.message.should.contain(`"functionName" is not defined in "${templatesDirectoryPath}/##folderName##/##fileName##.js"`);
			done();
		});
	});
});
