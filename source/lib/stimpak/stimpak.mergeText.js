import * as jsdiff from "diff";

export default function mergeText(stimpak, newFile, oldFile, done) {
	const oldContent = oldFile.contents.toString();
	const newContent = newFile.contents.toString();

	const differences = jsdiff.diffChars(
		oldContent,
		newContent
	);

	const mergedContent = differences.map(difference => {
		return difference.value;
	}).join("");

	newFile.contents = new Buffer(mergedContent);

	done(null, newFile);
}
