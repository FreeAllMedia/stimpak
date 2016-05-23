import Stimpak from "../../lib/stimpak/stimpak.js";
import interceptStdout from "intercept-stdout";
import newTemplate from "lodash.template";
import fileSystem from "fs";

describe("stimpak.logo()", () => {
	let stimpak,
			message,
			actualStdout,
			interceptStdoutEnd;

	beforeEach(done => {
		actualStdout = "";
		message = "I'm a logo message!";

		stimpak = new Stimpak();

		interceptStdoutEnd = interceptStdout(data => {
			actualStdout += data.toString();
		});

		stimpak
			.destination(__dirname)
			.logo(message)
			.generate((error) => {
				interceptStdoutEnd();
				done(error);
			});
	});

	it("should return itself to enable chaining", () => {
		stimpak.logo(message).should.eql(stimpak);
	});

	it("should display the logo via stdout", () => {
		const templateContents = fileSystem.readFileSync(`${__dirname}/../../lib/cli/templates/logo.txt`);
		const template = newTemplate(templateContents);

		const expectedStdout = template({
			message
		});

		actualStdout.should.eql(expectedStdout);
	});

	it("should display the logo without a message when called without arguments", done => {
		const templateContents = fileSystem.readFileSync(`${__dirname}/../../lib/cli/templates/logo.txt`);
		const template = newTemplate(templateContents);

		const expectedStdout = template({
			message: ""
		});

		actualStdout = "";

		interceptStdoutEnd = interceptStdout(data => {
			actualStdout += data.toString();
		});

		stimpak = new Stimpak();
		stimpak
			.destination(__dirname)
			.logo()
			.generate((error) => {
				interceptStdoutEnd();
				actualStdout.should.eql(expectedStdout);
				done(error);
			});
	});
});
