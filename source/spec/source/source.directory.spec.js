import { Source } from "../../lib/stimpak/stimpak.js";

describe("Source.directory()", () => {
	let source,
			globString;

	beforeEach(() => {
		globString = "**/*";
		source = new Source(globString);
	});

	it("should set directory to the current working directory by default", () => {
		source.directory().should.eql(process.cwd());
	});

	it("should overwrite the default when set", () => {
		const newDirectory = "/some/directory";
		source.directory(newDirectory);
		source.directory().should.eql(newDirectory);
	});
});
