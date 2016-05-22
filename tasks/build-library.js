import gulp from "gulp";
import babel from "gulp-babel";

import paths from "../paths.json";

gulp.task("build-library", () => {
	return gulp.src(paths.source.library)
		.pipe(babel())
		.pipe(gulp.dest(paths.build.directories.lib));
});
