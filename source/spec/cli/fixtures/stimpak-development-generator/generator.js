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
			.render("**/*")
				.directory(`${__dirname}/templates`);
	}
}
