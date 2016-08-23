import StimpakSubGenerator from "stimpak-subgenerator";

export default class Generator {
	setup(stimpak) {
		stimpak
			.use(StimpakSubGenerator)
			.prompt({
				type: "input",
				name: "promptName",
				message: "You should not see this"
			})
			.render("**/*", `${__dirname}/templates`)
			.merge("generated.js", createSecondFile);
	}
}

function createSecondFile(stimpak, newFile, oldFile, done) {
	newFile.path = newFile.path.replace("generated.js", "generated2.js");
	done(null, newFile);
}
