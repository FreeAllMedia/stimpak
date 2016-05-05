import privateData from "incognito";
import inquirer from "inquirer";

export default function prompt(...prompts) {
	const _ = privateData(this);

	const action = _.action;

	action.step((generator, stepDone) => {
		inquirer
			.prompt(prompts)
			.then(answers => {
				for (let answerName in answers) {
					const answer = answers[answerName];
					this.answers[answerName] = answer;
				}

				stepDone();
			});
		});

	return this;
}
