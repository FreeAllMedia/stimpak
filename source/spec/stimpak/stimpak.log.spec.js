import Stimpak from "../../lib/stimpak/stimpak.js";
import through from "through";
import util from "util";

describe(".log(message, ...payload)", () => {
	let stimpak,
			logStream,
			actualOutput;

	beforeEach(() => {
		stimpak = new Stimpak();

		actualOutput = "";
		logStream = through(streamData => {
			actualOutput += streamData;
		});

		stimpak.logStream(logStream);
	});

	it("should write the message to the designated log stream", () => {
		const expectedOutput = "Hello World!";

		stimpak
			.logStream(logStream)
			.log(expectedOutput);

		actualOutput.should.eql(expectedOutput);
	});

	it("should return this to enable chaining", () => {
		stimpak.log("Blah").should.eql(stimpak);
	});

	it("should write the inspected payload to the designated log stream", () => {
		const payload = {
			foo: "bar"
		};

		const logMessage = "Something";
		const expectedPayloadValue = util.inspect(payload);

		stimpak.log(logMessage, payload);

		const expectedOutput = `${logMessage}(${expectedPayloadValue})`;

		actualOutput.should.contain(expectedOutput);
	});
});
