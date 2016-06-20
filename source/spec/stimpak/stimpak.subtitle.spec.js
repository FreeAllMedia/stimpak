import Stimpak from "../../lib/stimpak/stimpak.js";
import interceptStdout from "intercept-stdout";

import ascii from "ascii-art";
ascii.Figlet.fontPath = `${__dirname}/../../../figlet-fonts/`;

describe("stimpak.subtitle()", () => {
	let stimpak,
			message,
			actualStdout,
			interceptStdoutEnd;

	beforeEach(done => {
		actualStdout = "";
		message = "Sub-Title";

		stimpak = new Stimpak();

		interceptStdoutEnd = interceptStdout(data => {
			actualStdout += data.toString();
		});

		stimpak
		.destination(__dirname)
		.subtitle(message)
		.generate((error) => {
			interceptStdoutEnd();
			done(error);
		});
	});

	it("should return itself to enable chaining", () => {
		stimpak.subtitle(message).should.eql(stimpak);
	});

	it("should be placed as a step in the queue", () => {
		stimpak.steps.length.should.eql(1);
	});

	it("should render a subtitle message using the 'Standard' FIGlet font", () => {
		actualStdout.should.eql(` ${message}\n`);
	});

	it("should render the text `Sub-Title` if no string is provided", done => {
		stimpak = new Stimpak();

		actualStdout = "";

		interceptStdoutEnd = interceptStdout(data => {
			actualStdout += data.toString();
		});

		const expectedStdout = " Sub-Title\n";

		stimpak
		.destination(__dirname)
		.subtitle()
		.generate(error => {
			interceptStdoutEnd();
			actualStdout.should.eql(expectedStdout);
			done(error);
		});
	});
});
