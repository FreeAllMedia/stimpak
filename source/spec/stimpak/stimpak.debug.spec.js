import Stimpak from "../../lib/stimpak/stimpak.js";
import through from "through";
import util from "util";

describe(".debug(message, ...payload)", () => {
	let stimpak,
			debugStream,
			actualOutput;

	beforeEach(() => {
		stimpak = new Stimpak();

		actualOutput = "";
		debugStream = through(streamData => {
			actualOutput += streamData;
		});

		stimpak.debugStream(debugStream);
	});

	it("should write the message to the designated debug stream", () => {
		const expectedOutput = "Hello World!";

		stimpak
			.debugStream(debugStream)
			.debug(expectedOutput);

		actualOutput.should.eql(`${expectedOutput}\n`);
	});

	it("should return this to enable chaining", () => {
		stimpak.debug("Blah").should.eql(stimpak);
	});

	it("should write the inspected payload to the designated debug stream", () => {
		const payload = {
			foo: "bar"
		};

		const debugMessage = "Something";
		const expectedPayloadValue = util.inspect(payload);

		stimpak.debug(debugMessage, payload);

		const expectedOutput = `${debugMessage}(${expectedPayloadValue})`;

		actualOutput.should.contain(expectedOutput);
	});
});
