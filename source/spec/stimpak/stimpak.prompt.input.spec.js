import Stimpak from "../../lib/stimpak/stimpak.js";
import intercept from "intercept-stdout";

describe("stimpak.prompt() (input)", () => {
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

	it("should return itself to enable chaining", () => {
		stimpak.prompt().should.eql(stimpak);
	});

	it("should add a step to display each prompt's questions", () => {
		stimpak.prompt(...prompts).steps.length.should.eql(1);
	});

	it("should not add a step if no prompts given", () => {
		stimpak.prompt().steps.length.should.eql(0);
	});

	it("should display each prompt's questions when `.generate()` is called", done => {
		let stdout = "";

		const stopIntercept = intercept(data => {
			stdout += data.toString();
		});

		stimpak
			.prompt(...prompts)
			.generate(error => {
				const results = {
					promptOne: stdout.indexOf(promptOne.message) !== -1,
					promptTwo: stdout.indexOf(promptTwo.message) !== -1
				};

				stopIntercept();

				// HACK: Find out why this try catch block is necessary to prevent a timeout
				try {
					results.should.eql({
						promptOne: true,
						promptTwo: true
					});

					done(error);
				} catch (ex) {
					done(ex);
				}
			});

		setTimeout(() => {
			process.stdin.emit("data", `${answers.firstName}\n`);
		}, 100);

		setTimeout(() => {
			process.stdin.emit("data", `${answers.lastName}\n`);
		}, 200);
	});

	it("should accept each prompt's answers", done => {
		stimpak
			.prompt(...prompts)
			.generate(error => {
				try {
					stimpak.answers().should.eql(answers);

					done(error);
				} catch (exception) {
					done(exception);
				}
			});

		setTimeout(() => {
			process.stdin.emit("data", `${answers.firstName}\n`);
		}, 100);

		setTimeout(() => {
			process.stdin.emit("data", `${answers.lastName}\n`);
		}, 200);
	});
});
