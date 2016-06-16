import Stimpak from "../../lib/stimpak/stimpak.js";

describe("stimpak.cast()", () => {
	let stimpak;
  let callbackA = answer => parseInt(answer);
  let callbackB = answer => 2 + answer;

	beforeEach(() => {
		stimpak = new Stimpak();
	});

	it("should return itself to enable chaining", () => {
		stimpak.cast(callbackA).should.eql(stimpak);
	});

	it("should be able to set multiple casts", () => {
		stimpak.cast(callbackA);
		stimpak.cast(callbackB);

    stimpak.cast().should.eql([callbackA, callbackB])
	});

	it("should not cast anything by default", () => {
		stimpak.cast().should.eql([]);
	});
});
