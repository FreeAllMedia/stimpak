import privateData from "incognito";

export default function generate(callback) {
	this.debug("generate");

	if (this.destination()) {
		const _ = privateData(this);
		const action = _.action;
		action.results(callback);
	} else {
		callback(new Error("You must set .destination() before you can .generate()"));
	}

	return this;
}
