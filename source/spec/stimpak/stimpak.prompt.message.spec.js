import Stimpak from "../../lib/stimpak/stimpak.js";
import intercept from "intercept-stdout";

describe("stimpak.prompt() (message)", function () {
	this.timeout(10000);

	let stimpak,
			data,
			actualStimObject,
			endIntercept;

	beforeEach(done => {
		stimpak = new Stimpak().test;

		data = "";

		endIntercept = intercept(newData => {
			data = data.concat(newData.toString());
		});

		stimpak.answers({
			message: "Are you ready?"
		});

		stimpak
		.prompt({
			type: "confirm",
			name: "proceed",
			message: stim => {
				actualStimObject = stim;
				return stim.answers().message;
			}
		})
		.generate(done);

		setTimeout(() => {
			process.stdin.emit("data", `y\n`);
		}, 100);
	});

	afterEach(() => endIntercept());

	it("should call `message` with stimpak as the first argument", () => {
		actualStimObject.should.eql(stimpak);
	});

	it("should use the return value of the message function as the message", () => {
		data.should.contain(stimpak.answers().message);
	});
});
