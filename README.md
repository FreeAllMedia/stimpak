# Stimpak.js

Easy to use code (re)generation system. Just answer questions to generate or update code with smart merging strategies.

``` shell
$ mkdir new-project
$ cd new-project
$ stimpak generator

? What is the name of your project? (new-project) new-project
? What style of test assertions do you prefer? (new-project) new-project
```

Stimpak can be used as either a command line utility, or a library that can be included in your own packages.

## Getting Started



``` shell
npm install stimpak -g
```

``` javascript
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
```
