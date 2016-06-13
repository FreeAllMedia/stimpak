export default class SubGenerator {
	constructor(stimpak) {
		stimpak
			.prompt({
				type: "input",
				name: "promptName",
				message: "You should not see this"
			})
			.source("**/*")
				.directory(`${__dirname}/templates`);
	}
}
