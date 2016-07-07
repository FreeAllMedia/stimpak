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
				this.write("\n");
			}

			let unansweredPrompts = prompts;

			const answers = this.answers();

			for (let answerName in answers) {
				unansweredPrompts = unansweredPrompts.filter(promptDefinition => {
					return (promptDefinition.name !== answerName);
				});
			}

			Async.mapSeries(unansweredPrompts, (unansweredPrompt, done) => {
				let askQuestion = true;

				if (unansweredPrompt.when) {
					askQuestion = unansweredPrompt.when(this);
					delete unansweredPrompt.when;
				}

				if (typeof unansweredPrompt.message === "function") {
					unansweredPrompt.message = unansweredPrompt.message(this);
				}

				if (typeof unansweredPrompt.default === "function") {
					unansweredPrompt.default = unansweredPrompt.default(this);
				}

				if (typeof unansweredPrompt.choices === "function") {
					unansweredPrompt.choices = unansweredPrompt.choices(this);
				}

				if (askQuestion) {
					inquirer
					.prompt(unansweredPrompt)
					.then(questionAnswers => {
						this.answers(questionAnswers);
						done();
					});
				} else {
					done();
				}
			}, stepDone);
		});
	}

	return this;
}
