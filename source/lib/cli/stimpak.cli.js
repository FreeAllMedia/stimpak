#!/usr/bin/env node
require("babel-polyfill");

/**
 * Local Dependencies
 */
import { run } from "./stimpak.cli.functions.js";

/**
 * It all starts with calling `.runCommand()`
 */
run(error => {
	if (error) { throw error; }
});
