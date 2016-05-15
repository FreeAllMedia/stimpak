import gulp from "gulp";

gulp.task("build", ["build-lib", "build-txt", "copy-mock-generators"]);
