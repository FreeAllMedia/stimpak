import Stimpak from "../../lib/stimpak/stimpak.js";
import intercept from "intercept-stdout";

describe("stimpak.prompt() (answers)", () => {
	let stimpak,
			prompts,
			promptOne,
			promptTwo,
			answers;

	beforeEach(function () {
		stimpak = new Stimpak()
			.destination("/some/path");

		prompts = [
			{
				type: "input",
				name: "firstName",
				message: "What is your first name?",
				default: "Bob"
			},
			{
				type: "input",
				name: "lastName",
				message: "What is your last name?",
				default: "Belcher"
			}
		];

		answers = {
			firstName: "Gene",
			lastName: "Belcher"
		};

		promptOne = prompts[0];
		promptTwo = prompts[1];
	});

	it("should skip prompts that have already been answered", (done) => {
		stimpak
			.prompt(...prompts)
			.then((self, thenDone) => {
				setTimeout(thenDone, 300);
			})
			.prompt(...prompts)
			.generate(error => {
				done(error);
			});

		setTimeout(() => {
			process.stdin.emit("data", `${answers.firstName}\n`);
		}, 100);

		setTimeout(() => {
			process.stdin.emit("data", `${answers.lastName}\n`);
		}, 200);
	});

	it("should skip prompts that have pre-existing answers", (done) => {
		let stdout = "";

		const stopIntercept = intercept(data => {
			stdout += data.toString();
		});

		stimpak
			.answers(answers)
			.prompt(...prompts)
			.generate(error => {
				let results = {
					promptOne: stdout.indexOf(promptOne.message) !== -1,
					promptTwo: stdout.indexOf(promptTwo.message) !== -1
				};

				stopIntercept();

				try {
					results.should.eql({
						promptOne: false,
						promptTwo: false
					});

					done(error);
				} catch (exception) {
					done(exception);
				}
			});
	});

	it("should use existing answers", () => {
		let firstName = "Neil";

		stimpak
			.prompt(...prompts)
			.answers({
				firstName
			})
			.generate(() => {
				stimpak.answers().should.eql({
					firstName,
					lastName: answers.lastName
				});
			});
	});

	it("should add each prompt's answers to stimpak.answers() before moving on to the next prompt", done => {
		const results = {};
		stimpak
			.prompt({
				type: "input",
				name: "firstName",
				message: "What is your first name?",
				default: "Bob"
			},
			{
				type: "input",
				name: "lastName",
				message: "What is your last name?",
				default: "Belcher",
				when: () => {
					results.firstName = stimpak.answers().firstName;
					return false;
				}
			})
			.generate(error => {
				results.should.eql({
					firstName: stimpak.answers().firstName
				});
				done(error);
			});

		setTimeout(() => {
			process.stdin.emit("data", `${answers.firstName}\n`);
		}, 100);
	});
});
