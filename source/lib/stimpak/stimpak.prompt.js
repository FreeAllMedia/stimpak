import privateData from "incognito";
import inquirer from "inquirer";

export default function prompt(...prompts) {
	this.debug("prompt", prompts);

	const _ = privateData(this);

	const action = _.action;

	if (prompts.length > 0) {
		action.step((generator, stepDone) => {
			let unansweredPrompts = prompts;

			const answers = this.answers();

			for (let answerName in answers) {
				unansweredPrompts = unansweredPrompts.filter(promptDefinition => {
					return (promptDefinition.name !== answerName);
				});
			}

			if (unansweredPrompts.length > 0) {
				inquirer
					.prompt(prompts)
					.then(questionAnswers => {
						this.answers(questionAnswers);
						stepDone();
					});

			} else {
				stepDone();
			}
		});
	}

	return this;
}
