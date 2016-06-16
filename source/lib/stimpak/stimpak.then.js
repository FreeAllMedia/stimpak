import privateData from "incognito";

export default function then(...stepFunctions) {
	this.debug("then", stepFunctions);
	const action = privateData(this).action;

	const originalContext = this.context();

	stepFunctions = stepFunctions.map(stepFunction => {
		return (stim, done) => {
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
		};
	});

	// stepFunctions.push(this.context());

	action.series(...stepFunctions);

	return this;
}
