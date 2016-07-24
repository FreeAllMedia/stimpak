import Template from "../../lib/template/template.js";

describe("Template(options)", () => {
	let template,
			options;

	beforeEach(() => {
		options = {
			content: "Hello, <%= name %>!",
			values: { name: "World" }
		};
		template = new Template(options);
	});

	it("should set content through options", () => {
		template.content().should.eql(options.content);
	});

	it("should set values through options", () => {
		template.values().should.eql(options.values);
	});
});
