import Stimpak from "../../lib/stimpak/stimpak.js";

describe("stimpak.steps", () => {
	let stimpak;

	beforeEach(() => {
		stimpak = new Stimpak();
	});

	it("should be an empty array by default", () => {
		stimpak.steps.should.eql([]);
	});
});
