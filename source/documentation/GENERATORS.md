[![](../images/stimpak-logo.png?raw=true)](../../README.md)

# Stimpak Generator Development

* [Generate a Generator?](#generateagenerator)
* [Stimpak Generator From Scratch](#stimpakgeneratorfromscratch)
	* [The Generator Constructor File](#thegeneratorconstructorfile)
	* [Add `.babelrc` For Automatic Transpiling](#addbabelrcforautomatictranspiling)
* [Customize Your Generator](#customizeyourgenerator)
	* [Set Answers With `.answers([object])`](#setanswerswithanswersobject)
	* [Get Answers With `.prompt(...prompts)`](#getanswerswithpromptprompts)
		* [Types of Prompts](#typesofprompts)
	* [Combine Generators With `.use(...GeneratorConstructors)`](#combinegeneratorswithusegeneratorconstructors)
	* [Render Templates Into Files With `.render(globString, templateDirectory)`](#rendertemplatesintofileswithrenderglobstringtemplatedirectory)



# Generate a Generator?

Why not? If you want to jump right into a working example of a stimpak generator, or want to see what a bare-bones stimpak generator looks like, you can use `stimpak-generator` to generate a starter project:

``` shell
$ npm install stimpak-generator -g --production

...

$ stimpak generator
```

You'll get to choose between a `bare bones` generator and a more elaborate generator called `bridge of death` which showcases more features.

# Stimpak Generator From Scratch

In a bare-bones stimpak generator, there are only 2 necessary files, and an optional 3rd:

1. a generator file you can name anything you want. In our examples we use `generator.js`.
2. a `package.json` file for `npm`.
3. an *optional* `.babelrc` file that you can add to enable automatic babel transpiling for your generator.
	* **Note:** If you prefer to write your generator in ES5, you can simply omit the `.babelrc` file from your generator.

**A typical bare-bones generator tree structure looks something like this:**

``` shell
$ tree
.
├── .babelrc
├── generator.js
└── package.json

0 directories, 3 files
```

## The Generator Constructor File

A stimpak generator module is nothing more than a vanilla javascript constructor exported as `default`, with a single special hook method called `.setup()` on it that accepts the `stimpak` object:

``` javascript
// ES6
export default class MyGenerator {
	setup(stimpak) {
		// Start here
	}
}
```

``` javascript
// ES5
exports.default = function MyGenerator() {
	this.setup = function setup(stimpak) {
		// Start here
	}
}
```

Beyond the module needing to be exported as `default` and there being a `.setup()` hook that accepts the `stimpak` object, there are no other restrictions on how your generator can be designed.


## Add `.babelrc` For Automatic Transpiling

**To enable automatic transpiling, a `.babelrc` file must be present in the root of your generator's directory.** This `.babelrc` file should contain the babel plugin presets applicable to your source code.

Typically, this means you'll want to use the `es2015` preset, but you can also use other presets in the future:

``` json
{
  "presets": ["es2015"]
}
```

**Note:** All package dependencies for transpiling are handled by stimpak itself, so you don't have to put them into your generator's `package.json` file.

# Customize Your Generator

Once you have your bare-bones generator ready for customization, it's time to customize it with the behavior you want.

For full API documentation, head over to the [Stimpak API](#API.md) page. The following guide is meant as a step-by-step to get others started by making a very simple generator that does not cover all of the features available.

## Set Answers With `.answers([object])`

Templates and functions use `.answers()` for placeholder values that can be used to render out files, provide commands with arguments, and more.

You can set `.answers()` manually, or have them set automatically by prompting users with plain-language questions.

``` javascript
export default class MyGenerator {
	setup(stimpak) {
		stimpak
		.answers({
			answerOne: true,
			answerTwo: false
		});

		stimpak.answers(); // { answerOne: true, answerTwo: false }
	}
}
```

**Answers aggregate!** So, if we call `.answers()` twice we'd end up with the following answer set:

``` javascript
export default class MyGenerator {
	setup(stimpak) {
		stimpak
		.answers({
			answerOne: true,
			answerTwo: false
		})
		.answers({
			answerOne: false,
			answerThree: true
		});

		stimpak.answers(); // { answerOne: false, answerTwo: false, answerThree: true }
	}
}
```

## Get Answers With `.prompt(...prompts)`

You can also set values in `.answers()` by using `.prompt()` to ask questions directly to the user on the command-line. Prompts are powered mostly by `inquirer.js` and supports all `inquirer.js` features, with just two key differences to keep in mind:

1. Prompt answers are available on `stimpak.answers()` immediately after each prompt, instead of after all prompts.
2. `when` functions are provided the stimpak object as the first argument instead of *just* the answers object.
	* You can still access all answers from `stimpak.answers()`:

``` javascript
const hasName = Symbol();

export default class MyGenerator {
	setup(stimpak) {
		stimpak
		.prompt({
			type: "confirm",
			name: "hasName",
			message: "Do you have a name?"
		}, {
			type: "input",
			name: "firstName",
			message: "What is your first name?",
			default: "Bob",
			when: this.hasName
		}, {
			type: "input",
			name: "lastName",
			message: "What is your last name?",
			default: "Belcher",
			when: this.hasName
		})
		.then(this.showAnswers);
	}

	showAnswers(stimpak) {
		stimpak.answers(); // { hasName: true, firstName: "Bob", lastName: "Belcher" }
	}

	hasName(stimpak) {
		return stim.answers().hasName;
	}
}
```

### Types of Prompts

* `confirm`: When you want to get a boolean (yes or no) response from the user.

	``` javascript
	export default class MyGenerator {
		setup(stimpak) {
			stimpak
			.prompt({
				type: "confirm",
				name: "hasName",
				message: "Do you have a name?",
				default: true
			})
			.then(stim => {
				stim.answers().hasName; // Boolean
			});
		}
	}
	```

* `input`: When you want a typed string response from the user.
	``` javascript
	export default class MyGenerator {
		setup(stimpak) {
			stimpak
			.prompt({
				type: "input",
				name: "firstName",
				message: "What is your first name?",
				default: "Bob"
			})
			.then(stim => {
				stim.answers().firstName; // String
			});
		}
	}
	```

* `password`: When you want the user to input a string without the value being visible on their screen.
	``` javascript
	export default class MyGenerator {
		setup(stimpak) {
			stimpak
			.prompt({
				type: "password",
				name: "pass",
				message: "Please type your password:"
			})
			.then(stim => {
				stim.answers().pass; // String
			});
		}
	}
	```

* `list`: When you want the user to choose one value from a list.
	``` javascript
	export default class MyGenerator {
		setup(stimpak) {
			stimpak
			.prompt({
				type: "list",
				name: "color",
				message: "What color should it be?",
				choices: [
					"red", "orange", "yellow", "green",
					"blue", "indigo", "violet"
				]
				default: "green"
			})
			.then(stim => {
				stim.answers().color; // String
			});
		}
	}
	```

* `checkbox`: When you want the user to choose multiple values from a list.
	``` javascript
	export default class MyGenerator {
		setup(stimpak) {
			stimpak
			.prompt({
				type: "checkbox",
				name: "colors",
				message: "What colors should it be?",
				choices: [
					"red", "orange", "yellow", "green",
					"blue", "indigo", "violet"
				]
				default: ["green", "yellow"]
			})
			.then(stim => {
				stim.answers().colors; // Array
			});
		}
	}
	```

* `expand`: When you want the user to quickly choose one choice from a list by specific keys:
	``` javascript
	export default class MyGenerator {
		setup(stimpak) {
			stimpak
			.prompt({
				type: "expand",
				name: "colors",
				message: "Conflict on `file.js`: ",
				choices: [
					{
						key: "y",
						name: "Overwrite",
						value: "overwrite"
					},
					{
						key: "a",
						name: "Overwrite this one and all next",
						value: "overwriteAll"
					},
					{
						key: "d",
						name: "Show diff",
						value: "diff"
					},
					new inquirer.Separator(),
					{
						key: "x",
						name: "Abort",
						value: "abort"
					}
				]
			})
			.then(stim => {
				stim.answers().colors; // Array
			});
		}
	}
	```

* `editor`: Launches an instance of the users preferred editor on a temporary file. Once the user exits their editor, the contents of the temporary file are read in as the result. The editor to use is determined by reading the $VISUAL or $EDITOR environment variables. If neither of those are present, notepad (on Windows) or vim (Linux or Mac) is used.
	``` javascript
	export default class MyGenerator {
		setup(stimpak) {
			stimpak
			.prompt({
				type: "editor",
				name: "fileContents",
				message: "Please write a short bio of at least 3 lines:",
				validate: this.validateFileContents
			})
			.then(stim => {
				stim.answers().fileContents; // String
			});
		}

		validateFileContents(text) {
			let returnValue = true;

			if (text.split("\n").length < 3) {
				returnValue = "Must be at least 3 lines.";
			}

			return returnValue;
		}
	}
	```

## Combine Generators With `.use(...GeneratorConstructors)`

You can `.use()` any other stimpak generator in your own generator, and it will seamlessly integrate all of it's features with your own:

``` javascript
import StimpakNpm from "stimpak-npm";
import StimpakTestDriven from "stimpak-test-driven";

export default class MyGenerator {
	setup(stimpak) {
		stimpak.use(
			StimpakNpm,
			StimpakTestDriven
		)
		.then(this.showAnswers);
	}

	showAnswers(stimpak) {
		stimpak.answers(); // All answers from stimpak-npm and stimpak-test-driven
	}
}
```

## Render Templates Into Files With `.render(globString, templateDirectory)`

Stimpak uses `underscore`-style templates to render any arbitrary text files using the answers provided.

* **Templates can interpolate answer values by wrapping them in `<%= … %>`**
* Templates can execute arbitrary JavaScript code by wrapping it in `<% … %>`.
* You can interpolate an answer value and have it be HTML-escaped by wrapping it in `<%- … %>`.

**my-generator/lib/generator.js**:

``` javascript
export default class MyGeneratorClassName {
	setup(stimpak) {
		stimpak
		.prompt({
			type: "input",
			name: "moduleName",
			message: "What will the module name be?",
			default: "My Module"
		}, {
			type: "input",
			name: "moduleDescription",
			message: "How would you describe the module?",
			default: "It's a new module!"
		})
		.render("**/*", `${__dirname}/templates`);
	}
}
```

**my-generator/templates/README.md**:

``` markdown
# <%= moduleName %>

<%= moduleDescription %>
```

**rendered-files/README.md**:

``` markdown
# My Module

It's a new module!
```

---

[Back to Table of Contents](#stimpakgeneratordevelopment)
