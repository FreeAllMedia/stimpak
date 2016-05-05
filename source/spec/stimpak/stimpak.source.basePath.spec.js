import Stimpak from "../../lib/stimpak/stimpak.js";

describe("stimpak.source() (basePath)", () => {
	let stimpak,
			path,
			options;

	beforeEach(() => {
		stimpak = new Stimpak();

		path = "/path/to/source/";
		options = {
			basePath: "/path/to/"
		};
	});

	it("should return itself to enable chaining when setting", () => {
		stimpak.source(path, options).should.eql(stimpak);
	});

	it("should set multiple values at once", () => {
		stimpak.source(path, options);
		stimpak.source().should.eql([[path, options]]);
	});

	it("should aggregate multiple value sets", () => {
		stimpak.source(path, options);
		stimpak.source(path, options);
		stimpak.source().should.eql([[path, options], [path, options]]);
	});

	it("should remove the basePath from the destination paths");
});
