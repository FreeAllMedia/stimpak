import Stimpak from "../../lib/stimpak/stimpak.js";
import sinon from "sinon";


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
});
