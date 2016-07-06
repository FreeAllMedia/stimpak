// TODO: Clean up subtitles spec

import Stimpak from "../../lib/stimpak/stimpak.js";
import interceptStdout from "intercept-stdout";

import ascii from "ascii-art";
ascii.Figlet.fontPath = `${__dirname}/../../../figlet-fonts/`;

describe("stimpak.subtitle()", () => {
	let stimpak,
			message,
			actualStdout,
			interceptStdoutEnd,
			renderedMessageStandard,
			renderedMessageSmall;

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

			ascii.font(message, "standard", renderedMessageOne => {
				renderedMessageStandard = renderedMessageOne;
				ascii.font(message, "small", renderedMessageTwo => {
					renderedMessageSmall = renderedMessageTwo;
					done(error);
				});
			});
		});
	});

	it("should return itself to enable chaining", () => {
		stimpak.subtitle(message).should.eql(stimpak);
	});

	it("should render a title message using the 'Standard' FIGlet font by default", () => {
		actualStdout.should.eql(`\n${renderedMessageStandard}`);
	});

	it("should render the text `Sub-Title` if no string is provided", done => {
		stimpak = new Stimpak();

		actualStdout = "";

		interceptStdoutEnd = interceptStdout(data => {
			actualStdout += data.toString();
		});

		stimpak
		.destination(__dirname)
		.subtitle()
		.generate(error => {
			interceptStdoutEnd();
			ascii.font("Sub-Title", "standard", renderedMessage => {
				actualStdout.should.eql(`\n${renderedMessage}`);
				done(error);
			});
		});
	});

	it("should let the user choose the figlet font", done => {
		stimpak = new Stimpak();

		actualStdout = "";

		interceptStdoutEnd = interceptStdout(data => {
			actualStdout += data.toString();
		});

		stimpak
		.destination(__dirname)
		.subtitle(message, "small")
		.generate(error => {
			interceptStdoutEnd();
			ascii.font(message, "small", renderedMessage => {
				actualStdout.should.eql(`\n${renderedMessage}`);
				done(error);
			});
		});
	});
});
