import Stimpak from "../../lib/stimpak/stimpak.js";

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
			differences = stimpak.report.diffFixtures(`${__dirname}/fixtures/existingDirectory/`);
			done(error);
		});
	});

	it("should render a directory with the path provided", () => {
		console.log({ act: differences.paths.actual, exp: differences.paths.expected});
		differences.paths.actual.should.eql(differences.paths.expected);
	});

	it("should not render the file before .generate is called", () => {
		stimpak = new Stimpak().test
		.add(path);

		(stimpak.report.files[path] === undefined).should.be.true;
	});
});
