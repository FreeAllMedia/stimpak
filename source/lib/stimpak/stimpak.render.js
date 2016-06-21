import Source from "../source/source.js";

export default function render(globString, directoryPath) {
	const newSource = new Source(this, globString, directoryPath);

	this.sources.push(newSource);

	this.then((stimpak, done) => {
		newSource.render(done);
	});

	return newSource;
}
