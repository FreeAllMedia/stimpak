export default class StimpakGeneratorError {
	setup(stimpak) {
		stimpak
			.then((generator, done) => {
				done(new Error("Generator Error!"));
			});
	}
}
