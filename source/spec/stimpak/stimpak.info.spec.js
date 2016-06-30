import Stimpak from "../../lib/stimpak/stimpak.js";
import util from "util";
import intercept from "intercept-stdout";

describe(".info(message, ...payload)", () => {
	let stimpak,
			actualOutput,
			stopIntercept,
			message;

	beforeEach(() => {
		message = "Blah";

		actualOutput = "";

		stopIntercept = intercept(data => {
			actualOutput += data.toString();
		});

		stimpak = new Stimpak()
			.info(message);
	});

	afterEach(() => stopIntercept());

	it("should not display the message right away", () => {
		actualOutput.should.not.contain(message);
	});

	it("should return this to enable chaining", () => {
		stimpak.info(message).should.eql(stimpak);
	});

	it("should write the message to stdout", done => {
		stimpak
		.info(message)
		.generate(error => {
			const expectedOutput = `\n${message}`;

			actualOutput.should.contain(expectedOutput);
			done(error);
		});
	});

	it("should write the inspected payload to stdout", done => {
		const payload = {
			foo: "bar"
		};

		const expectedPayloadValue = util.inspect(payload);

		stimpak
		.info(message, payload)
		.generate(error => {
			const expectedOutput = `\n${message}(${expectedPayloadValue})`;

			actualOutput.should.contain(expectedOutput);

			done(error);
		});
	});
});
