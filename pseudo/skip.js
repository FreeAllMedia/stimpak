stimpak
	.source("**/*").directory("./templates")
	.then((stimpak, done) => {
		if (!stimpak.answers().useGit) {
			stimpak.skip([
				"gulpfile.babel.js",
				"tasks/**/*"
			]);
		}
	});
