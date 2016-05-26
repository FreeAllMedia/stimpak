#!/usr/bin/env node
require("babel-polyfill");

import StimpakCliRunner from "./stimpak.cli.runner.js";

const stimpakCliRunner = new StimpakCliRunner();

stimpakCliRunner.run(process.argv, error => {
	if (error) { throw error; }
	// All done
});
