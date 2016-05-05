import Stimpak from "../../lib/stimpak/stimpak.js";

describe("stimpak.destination()", () => {
	let stimpak,
			path;

	beforeEach(() => {
		stimpak = new Stimpak();

		path = "/path/to/destination/";
	});

	it("should return itself to enable chaining", () => {
		stimpak.destination(path).should.eql(stimpak);
	});

	it("should its value when there are no arguments", () => {
		stimpak.destination(path);
		stimpak.destination().should.eql(path);
	});
});
