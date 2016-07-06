import Stimpak from "../../lib/stimpak/stimpak.js";

describe("stimpak.transforms()", () => {
	let stimpak;
	let callbackA = answer => parseInt(answer);
	let callbackB = answer => 2 + answer;

	beforeEach(() => {
		stimpak = new Stimpak();
	});

	it("should return itself to enable chaining", () => {
		stimpak.transforms(callbackA).should.eql(stimpak);
	});

	it("should be able to set multiple transforms", () => {
		stimpak.transforms(callbackA);
		stimpak.transforms(callbackB);

		stimpak.transforms().should.eql([callbackA, callbackB]);
	});

	it("should not transform anything by default", () => {
		stimpak.transforms().should.eql([]);
	});
});
