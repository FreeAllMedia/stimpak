// Idea for a migration system
stimpak
	.migrate("complexFile.js")
		.version("^0.1.0", addVersion2Features)
		.version("^0.2.0", addVersion3Features);

function addVersion2Features(stimpak, oldFile, newFile, mergeDone) {
	mergeDone(newFile);
}

function addVersion3Features(stimpak, oldFile, newFile, mergeDone) {
	mergeDone(newFile);
}
