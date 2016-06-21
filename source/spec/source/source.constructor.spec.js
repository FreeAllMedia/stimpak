import Stimpak, { Source } from "../../lib/stimpak/stimpak.js";

describe("Source.constructor()", () => {
	let source,
			globString,
			directoryPath,
			stimpak;

	beforeEach(() => {
		globString = "**/*";
		directoryPath = "/some/directory";
		stimpak = new Stimpak();
		source = new Source(stimpak, globString, directoryPath);
	});

	it("should return an instance of Source", () => {
		source.should.be.instanceOf(Source);
	});

	it("should add a render step to the stimpak queue", () => {
		stimpak.steps.length.should.eql(1);
	});
});
