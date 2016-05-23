export default class Generator {
	constructor(stimpak) {
		stimpak
			.prompt({
				type: "input",
				name: "promptName",
				message: "You should not see this"
			})
			.source("**/*")
				.directory(`${__dirname}/templates`)
			.merge("generated.js", createSecondFile);
	}
}

function createSecondFile(stimpak, newFile, oldFile, done) {
	newFile.stem = "generated2";
	done(null, newFile);
}
