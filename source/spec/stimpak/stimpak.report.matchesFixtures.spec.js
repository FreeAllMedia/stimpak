import Stimpak from "../../lib/stimpak/stimpak.js";

describe("stimpak.report.matchesFixtures()", () => {
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

		it("should return true when the files match the reports paths and contents", () => {
			stimpak.report.matchesFixtures(`${__dirname}/fixtures/simpleTemplatesRendered`).should.be.true;
		});

		it("should return false when files do not match the reports paths", () => {
			stimpak.report.matchesFixtures(`${__dirname}/fixtures/simpleTemplates`).should.be.false;
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

		it("should return false when files do not match the reports contents", () => {
			stimpak.report.matchesFixtures(`${__dirname}/fixtures/simpleTemplatesRendered`).should.be.false;
		});
	});
});
