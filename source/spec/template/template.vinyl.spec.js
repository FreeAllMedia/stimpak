import Template from "../../lib/template/template.js";
import Vinyl from "vinyl";

describe("template.vinyl()", () => {
	let template;

	beforeEach(() => {
		template = new Template();
	});

	it("should be writable", () => {
		const newVinyl = new Vinyl();
		template.vinyl(newVinyl);
		template.vinyl().should.eql(newVinyl);
	});

	it("should return an instance of Vinyl by default", () => {
		template.vinyl().should.be.instanceOf(Vinyl);
	});

	it("should return `this` when setting to allow chaining", () => {
		template.vinyl(new Vinyl()).should.eql(template);
	});
});
