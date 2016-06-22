<div style="text-align: center">
	![](images/stimpak-logo.png?raw=true)
</div>

## Key Features

* **Built For Ease-of-Use**
	*
* **Custom Branding**
	*
* **Modular Design**
	* Stimpak generators work like building blocks in that they can be used on their own, or combined with other generators to form even more complex behavior.
* **Simple-to-Use API**
	* Stimpak was designed from the ground-up to save time when developing and using code generators.
	* Only a few intuitive commands to memorize.
* **Automatic Just-In-Time ES6 Transpiling**
	* Write your generators in ES6 and have them work on all versions of Node (back to 0.10) without having to setup your own fancy transpiling stack!
	* Stimpak automatically transpiles generator code at runtime with no additional configuration.
	* Stimpak automatically transpiles generator code at runtime with no additional configuration.
* **Integrated Flow Control**
	* Easily ask questions, react to questions, and ask more questions without complicated if/else branches.
* **Well-Tested**
	* Carefully constructed tests.
	* Black-box tested.
	* 100% coverage.
* **Quality Controlled**
	* Continuous integration.
	* Automated quality auditing.
	* Automatic dependency management.

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
