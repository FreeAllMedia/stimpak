import Stimpak from "./source/lib/index.js";

const stimpak = new Stimpak();

stimpak
	.prompt(
		{
			type: "input",
			name: "dynamicFileName",
			message: "What would you like the file name to be?",
			default: "blah"
		},
		{
			type: "input",
			name: "className",
			message: "What's the class name?",
			default: "Blah"
		},
		{
			type: "input",
			name: "primaryFunctionName",
			message: "What's primary function name?",
			default: "initialize"
		}
	)
	.source("**/*")
		.directory(`${__dirname}/source/spec/stimpak/fixtures/templates`)
	.destination(`${__dirname}/pseudo/project`)
	.generate(() => {
		console.log("OK!");
	});

import glob from "glob";
