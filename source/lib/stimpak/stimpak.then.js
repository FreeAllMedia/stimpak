import privateData from "incognito";

export default function then(...stepFunctions) {
	const action = privateData(this).action;

	action.series(...stepFunctions);

	return this;
}
