import Template from "../../lib/template/template.js";

describe("Template()", () => {
	let template;

	beforeEach(() => {
		template = new Template();
	});

	it("should return an instance of Template", () => {
		template.should.be.instanceOf(Template);
	});
});
