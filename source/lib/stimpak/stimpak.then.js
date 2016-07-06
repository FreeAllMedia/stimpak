import privateData from "incognito";

// TODO: Optimize .then into multiple functions
export default function then(...stepFunctions) {
	this.debug("then", stepFunctions);
	const _ = privateData(this);

	const action = _.action;

	const originalContext = this.context();

	const stepFunctionTasks = stepFunctions.map(stepFunction => {
		return (stim, done) => {
			const currentContext = this.context();
			this.context(originalContext);

			const isAsynchronous = stepFunction.length === 2;

			if (isAsynchronous) {
				stepFunction.call(this.context(), stim, error => {
					this.context(currentContext);
					finished(error);
				});
			} else {
				try {
					stepFunction.call(this.context(), stim);
					this.context(currentContext);
					finished();
				} catch (error) {
					finished(error);
				}
			}

			function finished(error) {
				done(error);
			}
		};
	});

	action.series(...stepFunctionTasks);

	return this;
}
