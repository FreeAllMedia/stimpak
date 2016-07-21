import Template from "../../lib/template/template.js";
import intercept from "intercept-stdout";
import sinon from "sinon";
import util from "util";

let stdout,
		clock,
		endIntercept;

describe("template.log()", () => {
	let template,
			message,
			payload;

	beforeEach(() => {
		template = new Template();

		message = "Something happened";
		payload = {
			id: 23,
			type: "error",
			code: "500"
		};
	});

	beforeEach(() => {
		stdout = "";
		endIntercept = intercept(data => {
			stdout += data.toString();
		});
		clock = sinon.useFakeTimers();
	});

	afterEach(() => {
		endIntercept();
		clock.restore();
	});

	it("should return `this` when setting to allow chaining", () => {
		template.log(process.stdout).should.eql(template);
	});

	it("should write log messages to the stream provided", () => {
		template.debug(process.stdout);

		template.log(message);

		const date = new Date().toISOString().slice(11, -5);

		stdout.should.eql(`[${date}] ${message}\n`);
	});

	it("should write the payload to the next lines if provided", () => {
		template.debug(process.stdout);

		template.log(message, payload);

		const date = new Date().toISOString().slice(11, -5);

		stdout.should.eql(`[${date}] ${message}\n${util.inspect(payload)}\n`);
	});

	it("should NOT write log messages when a debug stream is not provided", () => {
		template.log(message, payload);

		stdout.should.eql("");
	});
});
