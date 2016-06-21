import Stimpak, { Source } from "../../lib/stimpak/stimpak.js";

describe("Source.basePath()", () => {
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

	it("should set basePath to directory by default", () => {
		source.basePath().should.eql(source.directory());
	});

	it("should be settable", () => {
		const newBasePath = "/some/directory";

		source.basePath(newBasePath);
		source.basePath().should.eql(newBasePath);
	});

	it("should return stimpak when setting to enable chaining", () => {
		source.basePath("/some/path").should.eql(source);
	});
});
