# Stimpak.js

Easy to use code (re)generation system. Just answer questions to generate or update code with smart merging strategies.

**CLI Example:**

``` shell
$ npm install stimpak stimpak-generator -g
$ stimpak generator
? What is the name of your new generator? my-generator
DONE!
```

**Library Example:**

``` javascript
import Stimpak from "./source/lib/index.js";

const stimpak = new Stimpak();

stimpak
	.source("**/*")
		.directory(`${__dirname}/source/spec/stimpak/fixtures/templates`)
	.destination(`${__dirname}/pseudo/project`)
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
	.generate(() => {
		console.log("OK!");
	});
```

Stimpak can be used as either a command line utility, or a library that can be included in your own packages.

## Getting Started

``` shell
npm install stimpak -g
```
