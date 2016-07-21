import Template from "../../lib/template/template.js";

describe("template.content()", () => {
	let template,
			path,
			content;

	beforeEach(() => {
		path = "some/path";
		content = "Hello, World!";
		template = new Template(path, content);
	});

	it("should be settable", () => {
		const newContent = "Hello, Universe!";
		template.path(newContent);
		template.path().should.eql(newContent);
	});

	it("should be settable by the constructor", () => {
		template.content().should.eql(content);
	});

	it("should return `this` when setting to allow chaining", () => {
		template.content("Baz").should.eql(template);
	});
});
