import privateData from "incognito";
import Async from "flowsync";

export default function prompt(...prompts) {
	const _ = privateData(this);

	const action = _.action;
	const promptly = _.promptly;

	action.step((generator, stepDone) => {
		Async.mapSeries(prompts, (newPrompt, promptDone) => {
			const message = newPrompt.message;
			promptly.prompt(message, (error, answer) => {
				this.answers[newPrompt.name] = answer;
				promptDone(error);
			});
		}, (error) => {
			stepDone(error);
		});
	});

	return this;
}
