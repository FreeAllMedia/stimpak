import Stimpak from "../../lib/stimpak/stimpak.js";

describe("stimpak.file(path, content)", () => {
	let stimpak,
			path,
			content,
			differences;

	beforeEach(done => {
		path = "letters/shapes.js";
		content = "export default function baz() {}\n";

		stimpak = new Stimpak().test;

		stimpak
		.file(path, content)
		.generate(error => {
			differences = stimpak.report.diffFixtures(`${__dirname}/fixtures/simpleExisting/`);
			done(error);
		});
	});

	it("should render a file with the path provided", () => {
		differences.paths.actual.should.eql(differences.paths.expected);
	});

	it("should render a file with the contents provided", () => {
		differences.content.should.eql({});
	});

	it("should not render the file before .generate is called", () => {
		stimpak = new Stimpak().test
		.file(path, content);

		differences = stimpak.report.diffFixtures(`${__dirname}/fixtures/simpleExisting`);

		differences.paths.actual.should.eql([]);
	});
});
