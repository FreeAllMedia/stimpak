import Stimpak from "../../lib/stimpak/stimpak.js";
import sinon from "sinon";
import fileSystem from "fs-extra";

describe("stimpak.merge()", () => {
	let stimpak,
			filePattern,
			mergeFunction;

	beforeEach(() => {
		stimpak = new Stimpak();

		filePattern = "/path/to/merge/";
		mergeFunction = sinon.spy((generator, oldFile, newFile, callback) => {
			callback();
		});
	});

	it("should return itself to enable chaining when setting", () => {
		stimpak.merge(filePattern, mergeFunction).should.eql(stimpak);
	});

	it("should set multiple values at once", () => {
		stimpak.merge(filePattern, mergeFunction);
		stimpak.merge().should.eql([[filePattern, mergeFunction]]);
	});

	it("should aggregate multiple value sets", () => {
		stimpak.merge(filePattern, mergeFunction);
		stimpak.merge(filePattern, mergeFunction);
		stimpak.merge().should.eql([[filePattern, mergeFunction], [filePattern, mergeFunction]]);
	});

	it("should accept a regular expression for the file pattern", () => {
		filePattern = new RegExp(filePattern);

		stimpak
			.merge(filePattern, mergeFunction);

		stimpak
			.merge().should.eql([[filePattern, mergeFunction]]);
	});

	it("should write only once per file when multiple merge strategies do not match", done => {
		stimpak.test;

		fileSystem.copySync(
			`${__dirname}/fixtures/simpleExisting`,
			stimpak.destination()
		);

		stimpak
		.answers({
			folderName: "letters",
			fileName: "shapes",
			functionName: "something"
		})
		.merge("dontmatch.js", mergeFunction)
		.merge("dontmatch.js", mergeFunction)
		.merge("dontmatch.js", mergeFunction)
		.render("**/*", `${__dirname}/fixtures/simpleTemplates`)
		.generate(error => {
			const eventTypes = stimpak.report.events.map(event => {
				return event.type;
			});

			eventTypes.should.eql([
				"writeDirectory",
				"writeFile",
				"writeFile"
			]);
			done(error);
		});
	});
});
