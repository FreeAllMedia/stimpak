import Stimpak from "../../lib/stimpak/stimpak.js";
import intercept from "intercept-stdout";

describe("stimpak.prompt()", () => {
	let stimpak,
			prompts,
			promptOne,
			promptTwo;

	beforeEach(function () {
		stimpak = new Stimpak();

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

		promptOne = prompts[0];
		promptTwo = prompts[1];
	});

	it("should return itself to enable chaining", () => {
		stimpak.prompt().should.eql(stimpak);
	});

	it("should add a step to display each prompt's questions", () => {
		stimpak.prompt().steps.length.should.eql(1);
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

				results.should.eql({
					promptOne: true,
					promptTwo: true
				});

				stopIntercept();

				done(error);
			});

		setTimeout(() => {
			process.stdin.emit("data", "Gene\n");
		}, 100);

		setTimeout(() => {
			process.stdin.emit("data", "Belcher\n");
		}, 200);
	});

	it("should accept each prompt's answers", done => {
		stimpak
			.prompt(...prompts)
			.generate(error => {
				stimpak.answers.should.eql({
					firstName: "Gene",
					lastName: "Belcher"
				});
				done(error);
			});

		setTimeout(() => {
			process.stdin.emit("data", "Gene\n");
		}, 100);

		setTimeout(() => {
			process.stdin.emit("data", "Belcher\n");
		}, 200);
	});
});
