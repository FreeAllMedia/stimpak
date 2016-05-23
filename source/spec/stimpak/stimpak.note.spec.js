import Stimpak from "../../lib/stimpak/stimpak.js";
import interceptStdout from "intercept-stdout";
import newTemplate from "lodash.template";
import fileSystem from "fs";

describe("stimpak.note()", () => {
	let stimpak,
			message,
			actualStdout,
			interceptStdoutEnd;

	beforeEach(done => {
		actualStdout = "";
		message = "I'm a note message!";

		stimpak = new Stimpak();

		interceptStdoutEnd = interceptStdout(data => {
			actualStdout += data.toString();
		});

		stimpak
			.destination(__dirname)
			.note(message)
			.generate(done);

		interceptStdoutEnd();
	});

	it("should return itself to enable chaining", () => {
		stimpak.note(message).should.eql(stimpak);
	});

	it("should display the note in a note box via stdout", () => {
		const templateContents = fileSystem.readFileSync(`${__dirname}/../../lib/cli/templates/note.txt`);
		const template = newTemplate(templateContents);

		const expectedStdout = template({
			message
		});

		actualStdout.should.eql(expectedStdout);
	});
});
