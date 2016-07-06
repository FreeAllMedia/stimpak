import Stimpak from "../../lib/stimpak/stimpak.js";
import interceptStdout from "intercept-stdout";

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

	it("should disable .title, .subtitle, .note, and .info", done => {
		let actualStdout = "";

		const endInterceptStdOut = interceptStdout(data => {
			actualStdout = actualStdout + data.toString();
		});

		stimpak
			.title("THIS")
			.subtitle("SHOULD")
			.note("NOT")
			.info("PRINT!")
			.generate(error => {
				actualStdout.should.eql("");
				endInterceptStdOut();
				done(error);
			});
	});
});
