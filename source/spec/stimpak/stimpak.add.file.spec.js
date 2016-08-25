import Stimpak from "../../lib/stimpak/stimpak.js";

describe("stimpak.add(path, [contents]) (file)", () => {
	let stimpak,
			path,
			contents,
			differences;

	beforeEach(done => {
		path = "colors/letters/shapes.js";
		contents = "export default function baz() {}\n";

		stimpak = new Stimpak().test;

		stimpak
		.add(path, contents)
		.generate(error => {
			differences = stimpak.report.diffFixtures(`${__dirname}/fixtures/deepExisting/`);
			done(error);
		});
	});

	it("should render a file with the path provided", () => {
		differences.paths.actual.should.eql(differences.paths.expected);
	});

	it("should render a file with the contents provided", () => {
		differences.contents.should.eql({});
	});

	it("should not render the file before .generate is called", () => {
		stimpak = new Stimpak().test
		.add(path, contents);

		differences = stimpak.report.diffFixtures(`${__dirname}/fixtures/simpleExisting`);

		differences.paths.actual.should.eql([]);
	});
});
