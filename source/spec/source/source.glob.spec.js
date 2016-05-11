import { Source } from "../../lib/stimpak/stimpak.js";

describe("Source.glob()", () => {
	let source,
			globString;

	beforeEach(() => {
		globString = "**/*";
		source = new Source(globString);
	});

	it("should set glob to the provided glob string", () => {
		source.glob().should.eql(globString);
	});

	it("should default to **/*", () => {
		source = new Source();
		source.glob().should.eql("**/*");
	});

	it("should be settable", () => {
		const newGlob = "*.json";
		source.glob(newGlob);
		source.glob().should.eql(newGlob);
	});

	it("should return stimpak when setting to enable chaining", () => {
		source.glob(globString).should.eql(source);
	});
});
