import Template from "../../lib/template/template.js";

describe("template.path()", () => {
	let template,
			path;

	beforeEach(() => {
		path = "some/path";
		template = new Template(path);
	});

	it("should be settable", () => {
		const newPath = "some/new/path";
		template.path(newPath);
		template.path().should.eql(newPath);
	});

	it("should be settable by the constructor", () => {
		template.path().should.eql(path);
	});

	it("should return `this` when setting to allow chaining", () => {
		template.path("some/other/path").should.eql(template);
	});
});
