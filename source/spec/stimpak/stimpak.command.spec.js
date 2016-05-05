import Stimpak from "../../lib/stimpak/stimpak.js";
import sinon from "sinon";

describe("stimpak.command()", () => {
	let stimpak,
			command,
			commandCallback,
			returnValue;

	beforeEach(() => {
		stimpak = new Stimpak();
		command = "echo 'The Dolphin'";
		commandCallback = sinon.spy((stdout, stderr, postCommandDone) => {
			postCommandDone();
		});
		returnValue = stimpak.command(command, commandCallback);
	});

	it("should return itself to enable chaining", () => {
		returnValue.should.eql(stimpak);
	});

	it("should add its step to .steps");
	it("should run the command and callback with stdout");
	it("should run the command and callback with stderr");
	it("should run the command and callback with a command done callback");
});
