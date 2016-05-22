import gulp from "gulp";
import mocha from "gulp-mocha";
import istanbul from "gulp-babel-istanbul";
import paths from "../paths.json";

import chai from "chai";
chai.should(); // This enables should-style syntax

gulp.task("test-coverage", (callback) => {
	gulp.src(paths.source.all)
		.pipe(istanbul()) // Covering files
		.pipe(istanbul.hookRequire()) // Force `require` to return covered files
		.on("finish", () => {
			gulp.src(paths.source.allSpec)
				.pipe(mocha())// --print summary|detail|none|both
				.pipe(istanbul.writeReports({dir: `${__dirname}/../coverage`, reporters: ["html", "text"]})) // Creating the reports after tests ran
				// .pipe(istanbul.enforceThresholds({ thresholds: { global: 100 } })) // Enforce a coverage of 100%
				.on("end", error => {
					callback(error);
					// Required to end the test due to
					// interactive CLI testing
					process.exit(0);
				});
		});
});
