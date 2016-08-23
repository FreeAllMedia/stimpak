import Stimpak from "../../lib/stimpak/stimpak.js";

describe("stimpak.report.diffFixtures()", () => {
	let stimpak,
			templatesDirectoryPath;

	beforeEach(() => {
		stimpak = new Stimpak();

		templatesDirectoryPath = `${__dirname}/fixtures/simpleTemplates`;

		stimpak.test;
	});

	describe("(with matching content)", () => {
		beforeEach(done => {
			stimpak
			.answers({
				fileName: "shapes",
				folderName: "letters",
				functionName: "foo"
			})
			.render("**/*", templatesDirectoryPath)
			.generate(done);
		});

		it("should return a difference object without differences when the files match the reports paths and contents", () => {
			const difference = stimpak.report.diffFixtures(`${__dirname}/fixtures/simpleTemplatesRendered`);
			difference.should.eql({
				paths: {
					actual: [
						"letters",
						"textures.js",
						"letters/shapes.js"
					],
					expected: [
						"letters",
						"textures.js",
						"letters/shapes.js"
					]
				},
				contents: {}
			});
		});

		it("should return the actual and expected paths differently", () => {
			const difference = stimpak.report.diffFixtures(`${__dirname}/fixtures/simpleTemplates`);
			const actualPaths = difference.paths.actual;
			const expectedPaths = difference.paths.expected;
			actualPaths.should.not.eql(expectedPaths);
		});
	});

	describe("(with mismatching content)", () => {
		beforeEach(done => {
			stimpak
			.answers({
				fileName: "shapes",
				folderName: "letters",
				functionName: "baz"
			})
			.render("**/*", templatesDirectoryPath)
			.generate(done);
		});

		it("should return a diff string of mismatched contents", () => {
			const differences = stimpak.report.diffFixtures(`${__dirname}/fixtures/simpleTemplatesRendered`);
			differences.contents.should.eql({
				["letters/shapes.js"]: {
					actual: "export default function baz() {}\n",
					expected: "export default function foo() {}\n"
				}
			});
		});
	});
});
