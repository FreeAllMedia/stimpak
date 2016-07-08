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

	let promptTransformed = {
		type: "input",
		name: "transformed",
		message: "Answer 5 please !",
		default: "5"
	};

	beforeEach(() => {
		stimpak = new Stimpak().test;
	});

	it("should transform answers from `.prompt`", done => {
		stimpak
		.prompt(promptUntouched)
		.then(() => {
			stimpak
				.transform(callbackA)
				.transform(callbackB);
		})
		.prompt(promptTransformed)
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

	it("should transform answers from `.answers`", () => {
		const answers = {
			number: "5"
		};

		stimpak
		.transform(callbackA)
		.answers(answers);

		stimpak.answers().number.should.eql(5);
	});

	it("should transform array values", () => {
		const answers = {
			numbers: ["1", "2", "3"]
		};

		stimpak
		.transform(callbackA)
		.answers(answers);

		stimpak.answers().numbers.should.have.members([1, 2, 3]);
	});


		it("should not transform answer if transform function returns falsy", () => {
			const answers = {
				string: "text"
			};

			stimpak
			.transform(callbackA)
			.answers(answers);

			stimpak.answers().string.should.eql("text");
		});
});
