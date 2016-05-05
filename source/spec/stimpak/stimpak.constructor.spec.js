import Stimpak from "../../lib/stimpak/stimpak.js";

describe("Stimpak.constructor()", () => {
	let stimpak;

	beforeEach(() => {
		stimpak = new Stimpak();
	});

	it("should return an instance of Stimpak", () => {
		stimpak.should.be.instanceOf(Stimpak);
	});
});
