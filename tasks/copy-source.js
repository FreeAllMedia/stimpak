import gulp from "gulp";
import paths from "../paths.json";

gulp.task("copy-source", () => {
	return gulp.src(paths.source.all)
		.pipe(gulp.dest(paths.build.directories.es5));
});
