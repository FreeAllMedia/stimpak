import privateData from "incognito";
import inquirer from "inquirer";
import Async from "flowsync";

export default function prompt(...prompts) {
	this.debug("prompt", prompts);

	const _ = privateData(this);
	const action = _.action;

	const needsLineBreak = Boolean(_.needsLineBreak);

	if (prompts.length > 0) {
		action.step((stimpak, stepDone) => {
			if (needsLineBreak) {
				process.stdout.write("\n");
			}

			let unansweredPrompts = prompts;

			const answers = this.answers();

			for (let answerName in answers) {
				unansweredPrompts = unansweredPrompts.filter(promptDefinition => {
					return (promptDefinition.name !== answerName);
				});
			}

			Async.mapSeries(unansweredPrompts, (unansweredPrompt, done) => {
				inquirer
					.prompt(unansweredPrompt)
					.then(questionAnswers => {
						this.answers(questionAnswers);
						done();
					});
			}, stepDone);
		});
	}

	return this;
}
