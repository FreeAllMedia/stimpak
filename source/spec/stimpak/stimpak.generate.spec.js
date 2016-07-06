import Stimpak from "../../lib/stimpak/stimpak.js";

describe("stimpak.generate()", () => {
	let stimpak;

	beforeEach(() => {
		stimpak = new Stimpak().test;
	});

	it("should not throw an error when there are no steps to run", done => {
		stimpak.generate(error => {
			done(error);
		});
	});
});
