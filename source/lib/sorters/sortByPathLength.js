export default function sortByPathLength(a, b) {
	return a.path().length - b.path().length;
}
