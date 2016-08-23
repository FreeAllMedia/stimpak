import SubGenerator2 from "stimpak-subgenerator-2";

export default class SubGenerator {
	setup(stimpak) {
		stimpak
			.use(SubGenerator2)
			.prompt({
				type: "input",
				name: "promptName",
				message: "You should not see this"
			})
			.render("**/*", `${__dirname}/templates`);
	}
}
