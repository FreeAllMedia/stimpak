import gulp from "gulp";
import runSequence from "run-sequence";

gulp.task("build", callback => {
	runSequence(
		"copy-source",
		["build-cli", "build-library"],
		callback
	);
});
