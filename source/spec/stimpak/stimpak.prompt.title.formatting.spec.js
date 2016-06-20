import Stimpak from "../../lib/stimpak/stimpak.js";
import interceptStdout from "intercept-stdout";

describe("stimpak.prompt() (.title formatting)", () => {
	let stimpak,
			prompts,
			answers,
			actualStdout;

	beforeEach(done => {
		actualStdout = "";

		stimpak = new Stimpak();

		const interceptStdoutEnd = interceptStdout(data => {
			actualStdout += data;
		});

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

		stimpak
		.destination(__dirname)
		.title()
		.prompt(prompts[0])
		.prompt(prompts[1])
		.generate((error) => {
			interceptStdoutEnd();
			done(error);
		});

		answers = {
			firstName: "Gene",
			lastName: "Belcher"
		};

		setTimeout(() => {
			process.stdin.emit("data", `${answers.firstName}\n`);
		}, 100);

		setTimeout(() => {
			process.stdin.emit("data", `${answers.lastName}\n`);
		}, 200);
	});

	it("should add a linebreak before prompting if the previous step was a .title", () => {
		actualStdout[0].toString().should.eql("\n");
	});

	it("should add linebreaks during steps instead of before them", () => {
		`${actualStdout[0]}${actualStdout[1]}`.should.not.eql("\n\n");
	});
});
