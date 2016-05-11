import Stimpak, { Source } from "../../lib/stimpak/stimpak.js";

describe("stimpak.source()", () => {
	let stimpak,
			globString;

	beforeEach(() => {
		stimpak = new Stimpak();

		globString = "**/*";
	});

	it("should return an instance of Source", () => {
		stimpak.source(globString).should.be.instanceOf(Source);
	});

	it("should add new instances to .sources", () => {
		const source = stimpak.source(globString);
		stimpak.sources.should.eql([source]);
	});
});
