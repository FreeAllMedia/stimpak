import Template from "../../lib/template/template.js";

describe("template.values()", () => {
	let template,
			content,
			values;

	beforeEach(() => {
		content = "Hello, World!";
		values = {
			"one": 1,
			2: "two"
		};
		template = new Template({ content, values });
	});

	it("should aggregate new values", () => {
		const newValues = {
			"one": "uno",
			"three": "tres"
		};
		template.values(newValues);
		template.values().should.eql({
			"one": "uno",
			2: "two",
			"three": "tres"
		});
	});

	it("should be settable by the constructor", () => {
		template.values().should.eql(values);
	});

	it("should return `this` when setting to allow chaining", () => {
		template.values({ something: "one" }).should.eql(template);
	});
});
