import privateData from "incognito";

export default function generate(callback) {
	const action = privateData(this).action;

	action
		.results(callback);

	return this;
}
