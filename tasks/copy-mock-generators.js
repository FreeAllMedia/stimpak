import gulp from "gulp";
import paths from "../paths.json";

gulp.task("copy-mock-generators", ["build-spec"], () => {
	return gulp.src(paths.build.generators)
		.pipe(gulp.dest("./node_modules"));
});
