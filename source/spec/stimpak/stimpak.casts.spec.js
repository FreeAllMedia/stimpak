import Stimpak from "../../lib/stimpak/stimpak.js";

describe("stimpak.casts()", () => {
	let stimpak;
	let callbackA = answer => parseInt(answer);
	let callbackB = answer => 2 + answer;

	beforeEach(() => {
		stimpak = new Stimpak();
	});

	it("should return itself to enable chaining", () => {
		stimpak.casts(callbackA).should.eql(stimpak);
	});

	it("should be able to set multiple casts", () => {
		stimpak.casts(callbackA);
		stimpak.casts(callbackB);

		stimpak.casts().should.eql([callbackA, callbackB]);
	});

	it("should not cast anything by default", () => {
		stimpak.casts().should.eql([]);
	});
});
