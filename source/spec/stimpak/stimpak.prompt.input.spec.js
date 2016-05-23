import Stimpak from "../../lib/stimpak/stimpak.js";
import intercept from "intercept-stdout";

describe("stimpak.prompt() (intercept)", () => {
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
				stimpak.answers().should.eql(answers);
				done(error);
			});

		setTimeout(() => {
			process.stdin.emit("data", `${answers.firstName}\n`);
		}, 100);

		setTimeout(() => {
			process.stdin.emit("data", `${answers.lastName}\n`);
		}, 200);
	});

	it("should skip prompts that already have answers", (done) => {
		let stdout = "";

		const stopIntercept = intercept(data => {
			stdout += data.toString();
		});

		stimpak
			.answers({
				firstName: "Neil"
			})
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
			process.stdin.emit("data", `BAD VALUE\n`);
		}, 500);
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

	it("should have a line return at the end of questioning", done => {
		let stdout = "";

		const stopIntercept = intercept(data => {
			stdout += data.toString();
		});

		stimpak
			// .answers({
			// 	firstName: "Bob",
			// 	lastName: "Belcher"
			// })
			.prompt(...prompts)
			.generate(error => {
				stopIntercept();

				try {
					process.stdout.write(stdout);
					stdout.should.eql("\u001b[32m?\u001b[39m \u001b[1mWhat is your first name?\u001b[22m \u001b[2m(Bob) \u001b[22m\u001b[33D\u001b[33C\u001b[1000D\u001b[K\u001b[32m?\u001b[39m \u001b[1mWhat is your first name?\u001b[22m \u001b[2m(Bob) \u001b[22mG\u001b[34D\u001b[34C\u001b[1000D\u001b[K\u001b[32m?\u001b[39m \u001b[1mWhat is your first name?\u001b[22m \u001b[2m(Bob) \u001b[22mG\u001b[34D\u001b[34C\u001b[1000D\u001b[K\u001b[32m?\u001b[39m \u001b[1mWhat is your first name?\u001b[22m \u001b[2m(Bob) \u001b[22mGe\u001b[35D\u001b[35C\u001b[1000D\u001b[K\u001b[32m?\u001b[39m \u001b[1mWhat is your first name?\u001b[22m \u001b[2m(Bob) \u001b[22mGe\u001b[35D\u001b[35C\u001b[1000D\u001b[K\u001b[32m?\u001b[39m \u001b[1mWhat is your first name?\u001b[22m \u001b[2m(Bob) \u001b[22mGen\u001b[36D\u001b[36C\u001b[1000D\u001b[K\u001b[32m?\u001b[39m \u001b[1mWhat is your first name?\u001b[22m \u001b[2m(Bob) \u001b[22mGen\u001b[36D\u001b[36C\u001b[1000D\u001b[K\u001b[32m?\u001b[39m \u001b[1mWhat is your first name?\u001b[22m \u001b[2m(Bob) \u001b[22mGene\u001b[37D\u001b[37C\u001b[1000D\u001b[K\u001b[32m?\u001b[39m \u001b[1mWhat is your first name?\u001b[22m \u001b[2m(Bob) \u001b[22mGene\u001b[37D\u001b[37C\u001b[1000D\u001b[K\u001b[32m?\u001b[39m \u001b[1mWhat is your first name?\u001b[22m \u001b[36mGene\u001b[39m\u001b[31D\u001b[31C\n\u001b[1000D\u001b[K\u001b[32m?\u001b[39m \u001b[1mWhat is your first name?\u001b[22m \u001b[36mGene\u001b[39m\u001b[31D\u001b[31C\n\u001b[32m?\u001b[39m \u001b[1mWhat is your last name?\u001b[22m \u001b[2m(Belcher) \u001b[22m\u001b[36D\u001b[36C\u001b[32m?\u001b[39m \u001b[1mWhat is your last name?\u001b[22m \u001b[2m(Belcher) \u001b[22m\u001b[36D\u001b[36C\u001b[1000D\u001b[K\u001b[32m?\u001b[39m \u001b[1mWhat is your last name?\u001b[22m \u001b[2m(Belcher) \u001b[22mB\u001b[37D\u001b[37C\u001b[1000D\u001b[K\u001b[32m?\u001b[39m \u001b[1mWhat is your last name?\u001b[22m \u001b[2m(Belcher) \u001b[22mB\u001b[37D\u001b[37C\u001b[1000D\u001b[K\u001b[32m?\u001b[39m \u001b[1mWhat is your last name?\u001b[22m \u001b[2m(Belcher) \u001b[22mBe\u001b[38D\u001b[38C\u001b[1000D\u001b[K\u001b[32m?\u001b[39m \u001b[1mWhat is your last name?\u001b[22m \u001b[2m(Belcher) \u001b[22mBe\u001b[38D\u001b[38C\u001b[1000D\u001b[K\u001b[32m?\u001b[39m \u001b[1mWhat is your last name?\u001b[22m \u001b[2m(Belcher) \u001b[22mBel\u001b[39D\u001b[39C\u001b[1000D\u001b[K\u001b[32m?\u001b[39m \u001b[1mWhat is your last name?\u001b[22m \u001b[2m(Belcher) \u001b[22mBel\u001b[39D\u001b[39C\u001b[1000D\u001b[K\u001b[32m?\u001b[39m \u001b[1mWhat is your last name?\u001b[22m \u001b[2m(Belcher) \u001b[22mBelc\u001b[40D\u001b[40C\u001b[1000D\u001b[K\u001b[32m?\u001b[39m \u001b[1mWhat is your last name?\u001b[22m \u001b[2m(Belcher) \u001b[22mBelc\u001b[40D\u001b[40C\u001b[1000D\u001b[K\u001b[32m?\u001b[39m \u001b[1mWhat is your last name?\u001b[22m \u001b[2m(Belcher) \u001b[22mBelch\u001b[41D\u001b[41C\u001b[1000D\u001b[K\u001b[32m?\u001b[39m \u001b[1mWhat is your last name?\u001b[22m \u001b[2m(Belcher) \u001b[22mBelch\u001b[41D\u001b[41C\u001b[1000D\u001b[K\u001b[32m?\u001b[39m \u001b[1mWhat is your last name?\u001b[22m \u001b[2m(Belcher) \u001b[22mBelche\u001b[42D\u001b[42C\u001b[1000D\u001b[K\u001b[32m?\u001b[39m \u001b[1mWhat is your last name?\u001b[22m \u001b[2m(Belcher) \u001b[22mBelche\u001b[42D\u001b[42C\u001b[1000D\u001b[K\u001b[32m?\u001b[39m \u001b[1mWhat is your last name?\u001b[22m \u001b[2m(Belcher) \u001b[22mBelcher\u001b[43D\u001b[43C\u001b[1000D\u001b[K\u001b[32m?\u001b[39m \u001b[1mWhat is your last name?\u001b[22m \u001b[2m(Belcher) \u001b[22mBelcher\u001b[43D\u001b[43C\u001b[1000D\u001b[K\u001b[32m?\u001b[39m \u001b[1mWhat is your last name?\u001b[22m \u001b[36mBelcher\u001b[39m\u001b[33D\u001b[33C\n\u001b[1000D\u001b[K\u001b[32m?\u001b[39m \u001b[1mWhat is your last name?\u001b[22m \u001b[36mBelcher\u001b[39m\u001b[33D\u001b[33C\n\n\n");
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
