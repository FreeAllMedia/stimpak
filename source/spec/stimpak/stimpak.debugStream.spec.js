import Stimpak from "../../../";
import through from "through";

describe(".debugStream(stream)", () => {
	it("should set the stream that debug calls are written to via options", () => {
		const expectedStream = through();

		const stimpak = new Stimpak({
			debugStream: expectedStream
		});

		stimpak.debugStream().should.eql(expectedStream);
	});

	it("should set the stream that debug calls are written to via function call", () => {
		const stimpak = new Stimpak();
		const expectedStream = through();

		stimpak.debugStream(expectedStream);
		stimpak.debugStream().should.eql(expectedStream);
	});
});
