import gulp from "gulp";

import paths from "../paths.json";

gulp.task("build-txt", ["copy-source"], () => {
	return gulp.src(paths.source.txt)
		.pipe(gulp.dest(paths.build.directories.lib));
});
