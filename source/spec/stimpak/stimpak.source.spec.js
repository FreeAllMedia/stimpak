import Stimpak, { Source } from "../../lib/stimpak/stimpak.js";

describe("stimpak.source()", () => {
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
		stimpak.source(globString).should.be.instanceOf(Source);
	});

	it("should add new instances to .sources", () => {
		const source = stimpak.source(globString);
		stimpak.sources.should.eql([source]);
	});

	it("should be able to set the directory at the same time", () => {
		const source = stimpak.source(globString, directoryPath);
		source.directory().should.eql(directoryPath);
	});

	it("should render sources in order", done => {
		let actualFilepaths;

		stimpak
		.source(globString, directoryPath)
		.then(() => {
			actualFilepaths = Object.keys(stimpak.report.files);
		})
		.source(globString, `${__dirname}/fixtures/simpleExisting`)
		.generate(error => {
			actualFilepaths.should.eql([
				`${stimpak.destination()}/shapes`,
				`${stimpak.destination()}/shapes/colors.js`,
				`${stimpak.destination()}/textures.js`
			]);
			done(error);
		});
	});
});
