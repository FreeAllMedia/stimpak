import Stimpak from "../../lib/stimpak/stimpak.js";

describe("stimpak.source()", () => {
	let stimpak,
			path;

	beforeEach(() => {
		stimpak = new Stimpak();

		path = "/path/to/source/";
	});

	it("should return itself to enable chaining when setting", () => {
		stimpak.source(path).should.eql(stimpak);
	});

	it("should set the path value", () => {
		stimpak.source(path);
		stimpak.source().should.eql([[path]]);
	});

	it("should aggregate multiple path values sets", () => {
		stimpak.source(path);
		stimpak.source(path);
		stimpak.source().should.eql([[path], [path]]);
	});
});
