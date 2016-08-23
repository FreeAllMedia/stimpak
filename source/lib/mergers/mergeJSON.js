import mergeWith from "lodash.mergewith";
import union from "lodash.union";
import isArray from "lodash.isarray";

export default function mergeJSON(stimpak, oldFile, newFile, done) {
	const oldFileJSON = JSON.parse(oldFile.contents);
	const newFileJSON = JSON.parse(newFile.contents);

	function concatArrays(array, value) {
		let newArray;

		if (isArray(array)) {
			newArray = union(array, value);
		}

		return newArray;
	}

	const mergedJSON = mergeWith(oldFileJSON, newFileJSON, concatArrays);
	const mergedJSONString = JSON.stringify(mergedJSON, null, 2);

	newFile.contents = new Buffer(`${mergedJSONString}\n`);

	done(null, newFile);
}
