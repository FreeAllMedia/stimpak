import Stimpak from "../../lib/stimpak/stimpak.js";
import sinon from "sinon";


describe("stimpak.onMerge()", () => {
	let stimpak,
			filePattern,
			mergeFunction;

	beforeEach(() => {
		stimpak = new Stimpak();

		filePattern = "/path/to/onMerge/";
		mergeFunction = sinon.spy((generator, oldFile, newFile, callback) => {
			callback();
		});
	});

	it("should return itself to enable chaining when setting", () => {
		stimpak.onMerge(filePattern, mergeFunction).should.eql(stimpak);
	});

	it("should set multiple values at once", () => {
		stimpak.onMerge(filePattern, mergeFunction);
		stimpak.onMerge().should.eql([[filePattern, mergeFunction]]);
	});

	it("should aggregate multiple value sets", () => {
		stimpak.onMerge(filePattern, mergeFunction);
		stimpak.onMerge(filePattern, mergeFunction);
		stimpak.onMerge().should.eql([[filePattern, mergeFunction], [filePattern, mergeFunction]]);
	});

	it("should accept a regular expression for the file pattern", () => {
		filePattern = new RegExp(filePattern);

		stimpak
			.onMerge(filePattern, mergeFunction);

		stimpak
			.onMerge().should.eql([[filePattern, mergeFunction]]);
	});
});
