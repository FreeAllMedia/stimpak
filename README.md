![](./images/stimpak-logo.png?raw=true)
<div style="text-align: center;">
![](./images/generate.gif?raw=true)
</div>

# Stimpak: A Pattern Management System

[![npm version](https://img.shields.io/npm/v/stimpak.svg)](https://www.npmjs.com/package/stimpak) [![license type](https://img.shields.io/npm/l/stimpak.svg)](https://github.com/FreeAllMedia/stimpak.git/blob/master/LICENSE)  [![Build Status](https://travis-ci.org/FreeAllMedia/stimpak.png?branch=master)](https://travis-ci.org/FreeAllMedia/stimpak) [![Coverage Status](https://coveralls.io/repos/github/FreeAllMedia/stimpak/badge.svg?branch=master)](https://coveralls.io/github/FreeAllMedia/stimpak?branch=master) [![Code Climate](https://codeclimate.com/github/FreeAllMedia/stimpak/badges/gpa.svg)](https://codeclimate.com/github/FreeAllMedia/stimpak) [![bitHound Score](https://www.bithound.io/github/FreeAllMedia/stimpak/badges/score.svg)](https://www.bithound.io/github/FreeAllMedia/stimpak) [![Dependency Status](https://david-dm.org/FreeAllMedia/stimpak.png?theme=shields.io)](https://david-dm.org/FreeAllMedia/stimpak?theme=shields.io) [![Dev Dependency Status](https://david-dm.org/FreeAllMedia/stimpak/dev-status.svg)](https://david-dm.org/FreeAllMedia/stimpak?theme=shields.io#info=devDependencies) [![npm downloads](https://img.shields.io/npm/dm/stimpak.svg)](https://www.npmjs.com/package/stimpak) ![Source: ECMAScript 6](https://img.shields.io/badge/Source-ECMAScript_2015-green.svg)

Software development (when doing it right) involves mostly patterns in both our code and our workflows. Automating these routine patterns and tasks frees us up to be more productive.

**Stimpak is a system for defining, discovering, and re-using code and workflow patterns:**

* Formalize code and workflow patterns with minimal effort so that they can be re-used and shared with others.
* Cut down on time doing routine tasks by generating new files based upon simple patterns.
* Update old files with new patterns using simple merging strategies.
* Develop automated expert systems that guide users through complicated tasks.

## Main Features

* **Very Easy-to-Use**
	* Everything about stimpak was designed with ease-of-use and time-savings in mind.
	* Minimal learning required. Get up and running within a few minutes.
	* Automatically backwards compatible with older versions of nodejs.
* **Customizable Branding**
	* Stimpak doesn't need to remind you that it's stimpak every time you use stimpak. ;)
	* Built-in ASCII-Art generator for BIG popping titles in any of 680 figlet fonts!

* **Unopinionated Modular Design**
	* Minimal learning required. Setup your directory structures the way you want. Name your methods how you'd like.
	* Create several individual generators, then combine them together in different ways to make compound generators that perform multiple tasks at once.

## Getting Started

To use stimpak to generate code, you'll first need to install `stimpak` as a global npm package, then either install an existing generator or write your own!

### Installation

Stimpak can be most easily installed via `npm` on the command line. Note that in most cases, `stimpak` needs to be installed globally (with the `-g` flag):

``` shell
$ npm install stimpak -g
```

### Finding Existing Generators

The easiest way to find existing generators for `stimpak` is via the package manager search website libraries.io.

[Click here to find an existing generators for stimpak](https://libraries.io/search?platforms=NPM&q=stimpak)

After you have found a generator you want to use, in most cases you will needs to install that generator globally (using the `-g` flag). For example, if you wanted to use the `stimpak-generator` module which is used for scaffolding new stimpak generators, you would need to install it globally via the following command:

``` shell
$ npm install stimpak-generator -g
```

### Using an Existing Generator

When the generator you want to use is installed along with the core stimpak package, you can use the generator by either calling it from the command line or using it programmatically via the API.

#### via Command-Line

To use a stimpak generator via command line, you'll want to first **type the `stimpak` command, then the name of the generator minus the `stimpak-` prefix.** For example, if we wanted to use the `stimpak-generator` module, we would type the following command:

``` shell
$ stimpak generator
```

**This will tell stimpak to use the designated generator**, which will begin prompting for answers to questions required for generating the desired files.

``` shell
$ stimpak generator

____ ___ _ _  _ ___  ____ _  _
[__   |  | |\/| |__] |__| |_/
___]  |  | |  | |    |  | | \_
              Generator v0.0.9


+--------------------+
| Basic Information: |
+--------------------+

? What do you want your generator to be named?
```

**Answer each question as it appears, until you see the "All done." message appear**, which lets you know that the code generation is complete.

``` shell
? What do you want your generator to be named? my-generator
? How would you describe your generator? It's a new generator. I don't really have a description for it, yet.

All done. See you next time!

```

**If you want to automatically answer a question**, you can add the answer as a flag after the generator name:

``` shell
$ stimpak generator \
	--projectName="My Project Name" \
	--projectDescription="This is my description!"

All done. See you next time!

```

#### via API

Stimpak can also be embedded into your own applications by installing it locally and including it as you would any other javascript module.

##### Local Installation

```shell
$ npm install stimpak stimpak-generator --save
```

``` javascript
import Stimpak from "stimpak";
import StimpakGenerator from "stimpak-generator";

const stimpak = new Stimpak();

stimpak
	.use(StimpakGenerator)
	.generate(error => {
		if (error) { throw error; }
		// Code is now generated
	});
```

## Writing a Custom Generator

![](./images/stimpak.customGenerator.gif)

Stimpak is designed to make writing generators easy. Fundamentally, a generator can be any object with a `.setup` method attached to it:

``` javascript
export default class StimpakGenerator {
	setup(stimpak) {
		// Do something with `stimpak` here
	}
}
```

That's it. No special directory names to memorize. No special object interfaces to satisfy. Just start making calls to stimpak in the `.setup` method of your object.

### Prompt For answers

Stimpak prompts are handled by [inquirer.js](https://github.com/SBoudrias/Inquirer.js/) and support all of its features.

``` javascript
export default class StimpakGenerator {
	setup(stimpak) {
		stimpak
			.prompt({
				type: "input",
				name: "packageVersion",
				message: "What version of the package should we use?",
				default: "10"
			});
	}
}
```

### Add Template Sources

To render template files using the provided answers, simply call `.source()` with a glob matching each template file within a designated directory name:

``` javascript
export default class StimpakGenerator {
	setup(stimpak) {
		stimpak
			.source(
				"**/*",
				`${__dirname}/templates`
			);
	}
}
```

### Add Template Sources

To render template files using the provided answers, simply call `.source()` with a glob matching each template file within a designated directory name:

``` javascript
export default class StimpakGenerator {
	setup(stimpak) {
		stimpak
			.source(
				"**/*",
				`${__dirname}/templates`
			);
	}
}
```

### Flow Control

Sometimes you'll want to carefully control the sequence of prompts and/or events in your generator. This is easy with stimpak's `.then` method:

``` javascript
export default class StimpakGenerator {
	setup(stimpak) {
		stimpak
			.source("**/*", `${__dirname}/templates`)
			.prompt({
				type: "input",
				name: "packageVersion",
				message: "What version of the package should we use?",
				default: "10"
			})
			.then(askAdditionalQuestions);
	}

	askAdditionalQuestions(stimpak) {
		const packageVersion = parseInt(stimpak.answers().packageVersion);

		if (packageVersion > 8) {
			stimpak.then(askNewQuestions);
		} else {
			stimpak.then(askOldQuestions);
		}
	}

	askNewQuestions() {
		stimpak.prompt({
			type: "input",
			name: "newQuestion",
			message: "What is dark matter?"
		});
	}

	askOldQuestions() {
		stimpak.prompt({
			type: "input",
			name: "oldQuestion",
			message: "Does the Higgs Boson exist?"
		});
	}
}
```
