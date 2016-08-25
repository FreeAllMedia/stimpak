import * as jsdiff from "diff";

export default function mergeText(stimpak, oldFile, newFile, done) {
	const oldContent = oldFile.contents.toString();
	const newContent = newFile.contents.toString();

	const differences = jsdiff.diffLines(
		oldContent,
		newContent
	);

	const mergedContent = differences
	//.filter(difference => !difference.removed)
	.map(difference => {
		return difference.value;
	}).join("");

	newFile.contents = new Buffer(mergedContent);

	done(null, newFile);
}
