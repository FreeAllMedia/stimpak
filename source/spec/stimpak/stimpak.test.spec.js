import Stimpak from "../../lib/stimpak/stimpak.js";

describe(".test", () => {
	let stimpak,
			returnValue;

	beforeEach(() => {
		stimpak = new Stimpak();
		returnValue = stimpak.test;
	});

	it("should return a itself to allow chaining", () => {
		returnValue.should.eql(stimpak);
	});

	it("should automatically set the destination to a temporary directory", () => {
		stimpak.destination().should.contain("stimpak-test");
	});
});
