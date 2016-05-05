import Stimpak from "../../lib/stimpak/stimpak.js";
import suppose from "suppose";
import path from "path";

const babelNodeFilePath = path.join(
	path.normalize(`${__dirname}/../../../`),
	"node_modules/babel-cli/bin/babel-node.js"
);

describe("stimpak.prompt()", () => {
	let stimpak,
			cli,
			promptOne,
			promptTwo;

	beforeEach(function () {
		this.timeout(3000); // To account for interactive CLI
		stimpak = new Stimpak();

		const prompts = require("./fixtures/stimpak.prompt.js").prompts;

		promptOne = prompts[0];
		promptTwo = prompts[1];

		const promptFixtureFilePath = "./source/spec/stimpak/fixtures/stimpak.prompt.js";

		cli = suppose(babelNodeFilePath, [promptFixtureFilePath], { debug: null });
	});

	it("should return itself to enable chaining", () => {
		stimpak.prompt().should.eql(stimpak);
	});

	it("should add a step to display each prompt's questions", () => {
		stimpak.prompt().steps.length.should.eql(1);
	});

	it("should display each prompt's questions when `.generate()` is called", done => {
		const results = {
			promptOne: false,
			promptTwo: false
		};

		cli
			.when(new RegExp(promptOne.message), () => {
				results.promptOne = true;
			}).respond("Gene\n")

			.when(new RegExp(promptTwo.message), () => {
				results.promptTwo = true;
			}).respond("Belcher\n")

			.on("error", error => done(error))

			.end(() => {
				results.should.eql({
					promptOne: true,
					promptTwo: true
				});
				done();
			});
	});

	it("should accept each prompt's answers", done => {
		let answersCorrect = false;

		const correctAnswerString = "ANSWERS: { firstName: 'Gene', lastName: 'Belcher' }";

		cli
			.when(new RegExp(promptOne.message))
				.respond("Gene\n")
			.when(new RegExp(promptTwo.message))
				.respond("Belcher\n")
			.when(new RegExp(correctAnswerString), () => {
				answersCorrect = true;
			})

			.on("error", error => done(error))

			.end(() => {
				answersCorrect.should.be.true;
				done();
			});
	});
});
