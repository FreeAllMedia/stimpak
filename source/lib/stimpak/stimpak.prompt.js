import privateData from "incognito";
import inquirer from "inquirer";

export default function prompt(...prompts) {
	const _ = privateData(this);

	const action = _.action;

	for (let answerName in this.answers()) {
		prompts = prompts.filter(promptDefinition => {
			return (promptDefinition.name !== answerName);
		});
	}

	if (prompts.length > 0) {
		action.step((generator, stepDone) => {
			inquirer
				.prompt(prompts)
				.then(questionAnswers => {
					for (let answerName in questionAnswers) {
						const answer = questionAnswers[answerName];
						const answers = this.answers();
						answers[answerName] = answer;
					}

					process.stdout.write("\n");

					stepDone();
				});
			});
	}

	return this;
}
