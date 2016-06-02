import { Source } from "../../lib/stimpak/stimpak.js";

describe("Source.directory()", () => {
	let source,
			globString;

	beforeEach(() => {
		globString = "**/*";
		source = new Source(globString);
	});

	it("should be able to set via the constructor", () => {
		const directoryPath = "blah";
		source = new Source(globString, directoryPath);
		source.directory().should.eql(directoryPath);
	});

	it("should be set to undefined by default", () => {
		(source.directory() === undefined).should.be.true;
	});

	it("should overwrite the default when set", () => {
		const newDirectory = "/some/directory";

		source.directory(newDirectory);
		source.directory().should.eql(newDirectory);
	});
});
