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
						"letters/shapes.js",
						"textures.js"
					],
					expected: [
						"letters",
						"letters/shapes.js",
						"textures.js"
					]
				},
				content: {}
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

		it("should return a diff string of mismatched content", () => {
			const differences = stimpak.report.diffFixtures(`${__dirname}/fixtures/simpleTemplatesRendered`);
			differences.content.should.eql({
				["letters/shapes.js"]: {
					actual: "export default function baz() {}\n",
					expected: "export default function foo() {}\n"
				}
			});
		});
	});
});
