import Template from "../../lib/template/template.js";

describe("template.content()", () => {
	let template,
			content;

	beforeEach(() => {
		content = "Hello, World!";
		template = new Template({ content });
	});

	it("should be settable", () => {
		const newContent = "Hello, Universe!";
		template.content(newContent);
		template.content().should.eql(newContent);
	});

	it("should be settable by the constructor", () => {
		template.content().should.eql(content);
	});

	it("should return `this` when setting to allow chaining", () => {
		template.content("Baz").should.eql(template);
	});
});
