import gulp from "gulp";
import babel from "gulp-babel";

import paths from "../paths.json";

gulp.task("build-lib", ["copy-source"], () => {
	return gulp.src(paths.source.lib)
		.pipe(babel())
		.pipe(gulp.dest(paths.build.directories.lib));
});
