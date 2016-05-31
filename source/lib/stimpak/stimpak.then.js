import privateData from "incognito";

export default function then(...stepFunctions) {
	this.debug("then", stepFunctions);
	const action = privateData(this).action;

	action.series(...stepFunctions);

	return this;
}
