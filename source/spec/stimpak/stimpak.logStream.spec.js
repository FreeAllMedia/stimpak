import Stimpak from "../../../";
import through from "through";

describe(".logStream(stream)", () => {
	it("should set the stream that log calls are written to via options", () => {
		const expectedStream = through();

		const stimpak = new Stimpak({
			logStream: expectedStream
		});

		stimpak.logStream().should.eql(expectedStream);
	});

	it("should set the stream that log calls are written to via function call", () => {
		const stimpak = new Stimpak();
		const expectedStream = through();

		stimpak.logStream(expectedStream);
		stimpak.logStream().should.eql(expectedStream);
	});

	it("should set the log stream to process.stdout by default", () => {
		const stimpak = new Stimpak();

		stimpak.logStream().should.eql(process.stdout);
	});
});
