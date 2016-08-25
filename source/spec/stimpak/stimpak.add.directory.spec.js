import Stimpak from "../../lib/stimpak/stimpak.js";
import fileSystem from "fs";

describe("stimpak.add(path, [contents]) (directory)", () => {
	let stimpak,
			path,
			differences;

	beforeEach(done => {
		path = "letters";

		stimpak = new Stimpak().test;

		stimpak
		.add(path)
		.generate(error => {
			const fixturesDirectoryPath = `${__dirname}/fixtures/existingDirectory/`;
			const actualFilePaths = fileSystem.readdirSync(fixturesDirectoryPath);
			console.log({ actualFilePaths });
			differences = stimpak.report.diffFixtures(fixturesDirectoryPath);
			done(error);
		});
	});

	it("should render a directory with the path provided", () => {
		console.log({isDir: fileSystem.statSync(`${stimpak.destination()}/${path}`).isDirectory(), act: differences.paths.actual, exp: differences.paths.expected});
		differences.paths.actual.should.eql(differences.paths.expected);
	});

	it("should not render the file before .generate is called", () => {
		stimpak = new Stimpak().test
		.add(path);

		differences = stimpak.report.diffFixtures(`${__dirname}/fixtures/existingDirectory/`);

		differences.paths.actual.should.eql([]);
	});
});
