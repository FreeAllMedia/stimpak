import StimpakDevelopmentSandbox from "./sandboxes/stimpakDevelopmentSandbox.js";

describe("(CLI) stimpak development", function () {
	this.timeout(20000);

	let sandbox;

	beforeEach(() => {
		sandbox = new StimpakDevelopmentSandbox();

		sandbox.setup();
	});

	afterEach(() => {
		sandbox.cleanup();
	});

	it("should add all necessary dependencies to deeply symlinked subgenerators", () => {
		const stdout = sandbox.runWithArguments("00000 --promptName=Blah");

		stdout.should.not.contain("Couldn't find preset");
	});
});
