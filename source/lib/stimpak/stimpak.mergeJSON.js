import mergeWith from "lodash.mergewith";

export default function mergeJSON(stimpak, newFile, oldFile, done) {
	const newFileJSON = JSON.parse(newFile.contents);
	const oldFileJSON = JSON.parse(oldFile.contents);

	function concatArrays(array, value) {
		let newArray;

		if (array.constructor === Array) {
			newArray = array.concat(value);
		}

		return newArray;
	}

	const mergedJSON = mergeWith(oldFileJSON, newFileJSON, concatArrays);
	const mergedJSONString = JSON.stringify(mergedJSON, null, 2);

	newFile.contents = new Buffer(`${mergedJSONString}\n`);

	done(null, newFile);
}
