import Stimpak from "../../lib/stimpak/stimpak.js";

describe("stimpak.context()", () => {
	let stimpak;
  let object = { "foo": "bar" };

	beforeEach(() => {
		stimpak = new Stimpak();
	});

	it("should return itself to enable chaining", () => {
		stimpak.context(object).should.eql(stimpak);
	});

	it("should return the context when no value is provided", () => {
		stimpak.context(object);
		stimpak.context().should.eql(object);
	});

	it("should use itself as the context by default", () => {
		stimpak.context().should.eql(stimpak);
	});
});
