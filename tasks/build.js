import gulp from "gulp";
import runSequence from "run-sequence";

gulp.task("build", () => {
	runSequence(
		"copy-source",
		["build-cli", "build-library"]
	);
});
