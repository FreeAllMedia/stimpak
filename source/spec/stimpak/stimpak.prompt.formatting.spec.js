import Stimpak from "../../lib/stimpak/stimpak.js";
import interceptStdout from "intercept-stdout";

describe("stimpak.prompt() (formatting)", () => {
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
			},
			{
				type: "input",
				name: "age",
				message: "How old are you?",
				default: "25"
			}
		];

		stimpak
		.destination(__dirname)
		.prompt(prompts[0])
		.then(() => {})
		.prompt(prompts[1])
		.prompt(prompts[2])
		.generate((error) => {
			interceptStdoutEnd();
			done(error);
		});

		answers = {
			firstName: "Gene",
			lastName: "Belcher",
			age: 11
		};

		setTimeout(() => {
			process.stdin.emit("data", `${answers.firstName}\n`);
		}, 100);

		setTimeout(() => {
			process.stdin.emit("data", `${answers.lastName}\n`);
		}, 200);

		setTimeout(() => {
			process.stdin.emit("data", `${answers.age}\n`);
		}, 300);
	});

	it("should add a linebreak before prompting if the previous step was not also a prompt", () => {
		actualStdout[0].toString().should.eql("\n");
	});

	it("should not add a linebreak before prompting if the previous step was also a prompt", () => {
		actualStdout.toString().should.not.contain(/\n\n.*What is your last name?/);
	});

	it("should add linebreaks during steps instead of before them", () => {
		`${actualStdout[0]}${actualStdout[1]}`.should.not.eql("\n\n");
	});
});
