import privateData from "incognito";

export default function then(...stepFunctions) {
	this.debug("then", stepFunctions);
	const action = privateData(this).action;

	stepFunctions.push(this.context());

	action.series(...stepFunctions);

	return this;
}
