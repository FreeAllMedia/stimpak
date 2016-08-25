import sortByPathLength from "../sorters/sortByPathLength.js";

export default function sortFileMixersByPathLength(fileMixers, done) {
	const sortedFileMixers = fileMixers.sort(sortByPathLength);
	done(null, sortedFileMixers);
}
