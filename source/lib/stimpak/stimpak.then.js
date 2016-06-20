import privateData from "incognito";

// TODO: Optimize .then
export default function then(...stepFunctions) {
	this.debug("then", stepFunctions);

	const _ = privateData(this);
	const action = _.action;

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

	action.series(...stepFunctions);

	return this;
}
