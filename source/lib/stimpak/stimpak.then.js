import privateData from "incognito";

// TODO: Optimize .then
export default function then(...stepFunctions) {
	this.debug("then", stepFunctions);

	const _ = privateData(this);
	const action = _.action;

	const originalContext = this.context();

	const stepFunctionTasks = stepFunctions.map(stepFunction => {
		const stepFunctionTask = (stim, done) => {
			const newContext = this.context();
			this.context(originalContext);

			const isAsynchronous = stepFunction.length === 2;

			if (isAsynchronous) {
				stepFunction.call(this.context(), stim, error => {
					this.context(newContext);
					done(error);
				});
			} else {
				try {
					stepFunction.call(this.context(), stim);
					this.context(newContext);
					done();
				} catch (error) {
					done(error);
				}
			}

			_.stepFunctionTasks = null;
		};

		return stepFunctionTask;
	});

	action.series(...stepFunctionTasks);

	// if (_.stepFunctionTasks) {
	// 	const parentStep = action.steps.filter(step => {
	// 		return step.steps === _.stepFunctionTasks;
	// 	})[0];
	//
	// 	const parentStepIndex = action.steps.indexOf(parentStep);
	//
	// 	action.steps.splice(parentStepIndex + 1, 0, {
	// 		concurrency: "series",
	// 		steps: stepFunctionTasks
	// 	});
	//
	// 	console.log("HMM");
	// } else {
	// 	action.series(...stepFunctionTasks);
	// }

	return this;
}
