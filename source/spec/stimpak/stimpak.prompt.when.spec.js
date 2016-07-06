import Stimpak from "../../lib/stimpak/stimpak.js";
import intercept from "intercept-stdout";

describe("stimpak.prompt() (when)", function () {
	this.timeout(10000);

	let stimpak,
			prompts,
			promptOne,
			promptTwo,
			actualObject,
			answers;

	beforeEach(done => {
		stimpak = new Stimpak().test;

		prompts = [
			{
				type: "confirm",
				name: "proceed",
				message: "Do you wish to proceed?",
				when: self => {
					actualObject = self;
					return true;
				}
			},
			{
				type: "confirm",
				name: "proceedAgain",
				message: "Are you sure you wish to proceed?",
				when: self => self.answers().proceed
			}
		];

		answers = {
			proceed: "y",
			proceedAgain: "n"
		};

		promptOne = prompts[0];
		promptTwo = prompts[1];

		stimpak
			.prompt(...prompts)
			.generate(done);

		setTimeout(() => {
			process.stdin.emit("data", `${answers.proceed}\n`);
		}, 100);

		setTimeout(() => {
			process.stdin.emit("data", `${answers.proceedAgain}\n`);
		}, 200);
	});

	it("should call `when` with stimpak as the first argument", () => {
		actualObject.should.eql(stimpak);
	});
});
