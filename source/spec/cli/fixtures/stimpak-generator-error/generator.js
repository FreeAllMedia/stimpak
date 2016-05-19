export default class Generator {
	constructor(stimpak) {
		stimpak
			.then((generator, done) => {
				done(new Error("Generator 3 Error!"));
			});
	}
}
