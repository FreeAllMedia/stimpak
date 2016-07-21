import Template from "../../lib/template/template.js";
import intercept from "intercept-stdout";
import sinon from "sinon";

let stdout,
		clock,
		endIntercept;

describe("template.debug()", () => {
	let template;

	beforeEach(() => {
		stdout = "";
		endIntercept = intercept(data => {
			stdout += data.toString();
		});
		clock = sinon.useFakeTimers();

		template = new Template();
	});

	afterEach(() => {
		endIntercept();
		clock.restore();
	});

	it("should be writable", () => {
		template.debug(process.stdout);
		template.debug().should.eql(process.stdout);
	});

	it("should return null by default", () => {
		(template.debug() === null).should.be.true;
	});

	it("should return `this` when setting to allow chaining", () => {
		template.debug(process.stdout).should.eql(template);
	});
});
