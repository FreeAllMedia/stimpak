import Stimpak, { Source } from "../../lib/stimpak/stimpak.js";

describe("stimpak.render()", () => {
	let stimpak,
			globString,
			directoryPath;

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
		directoryPath = `${__dirname}/fixtures/simpleTemplates`;
	});

	it("should return an instance of Source", () => {
		stimpak.render(globString).should.be.instanceOf(Source);
	});

	it("should add new instances to .sources", () => {
		const source = stimpak.render(globString);
		stimpak.sources.should.eql([source]);
	});

	it("should be able to set the directory at the same time", () => {
		const source = stimpak.render(globString, directoryPath);
		source.directory().should.eql(directoryPath);
	});

	it("should render sources in order", done => {
		let actualFilepaths;

		stimpak
		.render(globString, directoryPath)
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
		.render(globString, directoryPath)
		.generate(error => {
			error.should.be.instanceOf(Error);
			done();
		});
	});
});
