import Stimpak from "../../lib/stimpak/stimpak.js";
import util from "util";
import intercept from "intercept-stdout";

describe(".info(message, ...payload)", () => {
	let stimpak,
			actualOutput;

	beforeEach(() => {
		stimpak = new Stimpak();
	});

	it("should write the message to the designated info stream", () => {
		actualOutput = "";

		const stopIntercept = intercept(data => {
			actualOutput += data.toString();
		});

		const infoMessage = "Something";

		stimpak.info(infoMessage);

		stopIntercept();

		const expectedOutput = `\n[ ${infoMessage} ]`;

		actualOutput.should.contain(expectedOutput);
	});

	it("should return this to enable chaining", () => {
		stimpak.info("Blah").should.eql(stimpak);
	});

	it("should write the inspected payload to the designated info stream", () => {
		actualOutput = "";

		const stopIntercept = intercept(data => {
			actualOutput += data.toString();
		});

		const payload = {
			foo: "bar"
		};

		const infoMessage = "Something";
		const expectedPayloadValue = util.inspect(payload);

		stimpak.info(infoMessage, payload);

		stopIntercept();

		const expectedOutput = `\n[ ${infoMessage}(${expectedPayloadValue}) ]`;

		actualOutput.should.contain(expectedOutput);
	});
});
