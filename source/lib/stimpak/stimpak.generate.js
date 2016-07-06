import privateData from "incognito";

export default function generate(callback) {
	this.debug("generate");

	const _ = privateData(this);
	const action = _.action;
	action.results(callback);

	return this;
}
