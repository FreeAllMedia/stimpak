#!/usr/bin/env node
"use strict";

var _stimpakCliFunctions = require("./stimpak.cli.functions.js");

require("babel-polyfill");

/**
 * Local Dependencies
 */


/**
 * It all starts with calling `.runCommand()`
 */
(0, _stimpakCliFunctions.run)(function (error) {
  if (error) {
    throw error;
  }
});