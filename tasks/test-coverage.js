/* eslint-disable no-process-exit */
import gulp from "gulp";
import mocha from "gulp-mocha";
import istanbul from "gulp-babel-istanbul";
import paths from "../paths.json";

import chai from "chai";
chai.should(); // This enables should-style syntax

gulp.task("test-coverage", ["build"], callback => {
	gulp.src(paths.source.library)
		.pipe(istanbul({
			"verbose": false,
			"instrumentation": {
				"default-excludes": false
			}
		})) // Covering files
		.pipe(istanbul.hookRequire()) // Force `require` to return covered files
		.on("finish", () => {
			gulp.src(paths.source.librarySpec)
				.pipe(mocha())
				.pipe(istanbul.writeReports({dir: `${__dirname}/../coverage`, reporters: ["html", "text"]})) // Creating the reports after tests ran
				// .pipe(istanbul.enforceThresholds({ thresholds: { global: 100 } })) // Enforce a coverage of 100%
				.once("end", error => {
					callback(error);
					// Required to end the test due to
					// interactive CLI testing
					process.exit(0);
				});
		});
});
