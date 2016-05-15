import Stimpak from "../../../lib/stimpak/stimpak.js";
import util from "util";

const prompts = [
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

const stimpak = new Stimpak();

stimpak
	.prompt(...prompts)
	.generate(() => {
		process.stdout.write(`ANSWERS: ${util.inspect(stimpak.answers)}\n`);
	});

export { prompts };
