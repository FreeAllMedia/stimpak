import gulp from "gulp";
import babel from "gulp-babel";

import paths from "../paths.json";

gulp.task("build-cli", () => {
	return gulp.src(paths.source.cli)
		.pipe(babel())
		.pipe(gulp.dest(paths.build.directories.lib));
});
