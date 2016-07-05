import Stimpak from "../../lib/stimpak/stimpak.js";

describe("stimpak.prompt() (default)", function () {
	this.timeout(10000);

	let stimpak,
			actualStimObject,
			endIntercept;

	beforeEach(done => {
		stimpak = new Stimpak().test;

		stimpak.answers({
			default: "green"
		});

		stimpak
		.prompt({
			type: "list",
			name: "favoriteColor",
			message: "What is your favorite color?",
			choices: ["red", "green", "blue"],
			default: stim => {
				actualStimObject = stim;
				return stim.answers().default;
			}
		})
		.generate(done);

		setTimeout(() => {
			process.stdin.emit("data", `\n`);
		}, 100);
	});

	it("should call `default` with stimpak as the first argument", () => {
		actualStimObject.should.eql(stimpak);
	});

	it("should use the return value of the default function as the default", () => {
		stimpak.answers().favoriteColor.should.eql(stimpak.answers().default);
	});
});
