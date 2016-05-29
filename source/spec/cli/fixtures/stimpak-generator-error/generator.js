export default class StimpakGeneratorError {
	constructor(stimpak) {
		stimpak
			.then((generator, done) => {
				done(new Error("Generator Error!"));
			});
	}
}
