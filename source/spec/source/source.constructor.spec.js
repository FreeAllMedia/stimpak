import { Source } from "../../lib/stimpak/stimpak.js";

describe("Source.constructor()", () => {
	let source,
			globString;

	beforeEach(() => {
		globString = "**/*";
		source = new Source(globString);
	});

	it("should return an instance of Source", () => {
		source.should.be.instanceOf(Source);
	});
});
