import Stimpak from "../../lib/stimpak/stimpak.js";
import intercept from "intercept-stdout";
import stripAnsi from "strip-ansi";

describe("stimpak.prompt() (choices)", function () {
	this.timeout(10000);

	let stimpak,
			data,
			actualStimObject,
			endIntercept;

	beforeEach(done => {
		stimpak = new Stimpak().test;

		data = "";

		endIntercept = intercept(newData => {
			data = data.concat(stripAnsi(newData.toString()));
		});

		stimpak.answers({
			choices: ["red", "green", "blue"]
		});

		stimpak
		.prompt({
			type: "list",
			name: "favoriteColor",
			message: "What is your favorite color?",
			choices: stim => {
				actualStimObject = stim;
				return stim.answers().choices;
			}
		})
		.generate(done);

		setTimeout(() => {
			process.stdin.emit("data", `\n`);
		}, 100);
	});

	afterEach(() => endIntercept());

	it("should call `choices` with stimpak as the first argument", () => {
		actualStimObject.should.eql(stimpak);
	});

	it("should use the return value of the choices function as the choices", () => {
		data.should.contain(stimpak.answers().choices.join(" \n  "));
	});
});
