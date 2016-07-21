import Template from "../../lib/template/template.js";

describe("Template()", () => {
	let template,
			path,
			content;

	beforeEach(() => {
		path = "some/path";
		content = "Hello, World!";
		template = new Template(path, content);
	});

	it("should return an instance of Template", () => {
		template.should.be.instanceOf(Template);
	});

	it("should instantiate without arguments", () => {
		template = new Template();
	});
});
