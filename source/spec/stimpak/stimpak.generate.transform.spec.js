import Stimpak from "../../lib/stimpak/stimpak.js";

describe("stimpak.generate() (transformed answers)", () => {
	let stimpak;

	let callbackA = answer => parseInt(answer);
	let callbackB = answer => 2 + answer;

	let promptUntouched = {
		type: "input",
		name: "untouched",
		message: "Answer 5 please !",
		default: "5"
	};

	let promptCasted = {
		type: "input",
		name: "transformed",
		message: "Answer 5 please !",
		default: "5"
	};

	beforeEach(() => {
		stimpak = new Stimpak().destination("some/path");
	});

	it("should transform provided answers", done => {
		stimpak
			.prompt(promptUntouched)
			.transform(callbackA)
			.transform(callbackB)
			.prompt(promptCasted)
			.generate(error => {
				try {
					stimpak.answers().should.eql({
						untouched: "5",
						transformed: 7
					});
					done(error);
				} catch (exception) {
					done(exception);
				}
			});

		setTimeout(() => {
			process.stdin.emit("data", `5\n`);
		}, 100);

		setTimeout(() => {
			process.stdin.emit("data", `5\n`);
		}, 200);
	});

	it("should transform given answers", done => {
		let answers = {
			transformed: 5,
			untouched: "5"
		};

		stimpak
			.answers(answers)
			.transform(callbackA)
			.generate(error => {
				stimpak.answers().transformed.should.eql(5);
				stimpak.answers().untouched.should.eql("5");

				done(error);
			});
	});
});
