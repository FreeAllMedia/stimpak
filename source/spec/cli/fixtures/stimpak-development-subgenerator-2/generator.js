export default class SubGenerator {
	setup(stimpak) {
		stimpak
			.prompt({
				type: "input",
				name: "promptName",
				message: "You should not see this"
			})
			.render("**/*")
				.directory(`${__dirname}/templates`);
	}
}
