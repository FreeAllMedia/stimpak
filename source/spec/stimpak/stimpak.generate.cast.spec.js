import Stimpak from "../../lib/stimpak/stimpak.js";

describe("stimpak.generate() (casted answers)", () => {
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
		name: "casted",
		message: "Answer 5 please !",
		default: "5"
	};

	beforeEach(() => {
		stimpak = new Stimpak().destination("some/path");
	});

	it("should cast provided answers", done => {
		stimpak
			.prompt(promptUntouched)
			.cast(callbackA)
			.cast(callbackB)
			.prompt(promptCasted)
			.generate(error => {
				try {
					stimpak.answers().should.eql({
						untouched: "5",
						casted: 7,
					});
					done();
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

	it("should cast given answers", done => {
		let answers = {
			casted: 5,
			untouched: "5"
		};

		stimpak
			.answers(answers)
			.cast(callbackA)
			.generate(error => {
				stimpak.answers().casted.should.eql(5);
				stimpak.answers().untouched.should.eql("5");

				done();
			});
	});
});
