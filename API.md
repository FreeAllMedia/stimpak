[![](./images/stimpak-logo.png?raw=true)](./README.md)

# Stimpak API

Stimpak has a **chainable** common API that can be used to build generators or run them.

Check out these guides to learn more about:

* [building generators](./GENERATORS.md)
* [running generators](./CLI.md)

## Method Guide

* **[`.answers([object])`](#answersobject)**
	* Set answers manually.
	* Get answers that are already set if called without an argument.
* **[`.prompt(...promptObjects)`](#promptpromptobjects)**
	* Set answers by prompting the user with [`inquirer.js`](https://github.com/SBoudrias/Inquirer.js)-style prompts.
* **[`.use(...GeneratorConstructors)`](#usegeneratorconstructors)**
	* Use another generator. Runs the generator as though
* **[`.destination(directoryPath)`](#destinationdirectorypath)**
	* Set the directory that files should be generated/updated in.
* **[`.render(globString, templateDirectoryPath)`](#renderglobstring-templatedirectorypath)**
	* Set one or more files as templates to render into the `.destination` directory.
* **[`.merge(globString, [mergeStrategyFunction])`](#mergeglobstring-mergestrategyfunction)**
	* Set a file to be merged instead of overwritten.
	* Use default strategies or provide a custom merge strategy function.
* **[`.command(commandString, [outputHandlerFunction])`](#commandcommandstring-outputhandlerfunction)**
	* Call a shell command via child-process.
	* *Optionally*: Provide an output handler function that handles the command's `stdout` and `stderr` values.
* **[`.title(text, [figletFontName])`](#titletext-figletfontname)**
	* Display text to the user using figlet ASCII fonts.
	* Displays only once per `.generate`.
* **[`.subtitle(text, [figletFontName])`](#subtitletext-figletfontname)**
	* Display text to the user using figlet ASCII fonts.
	* Displays every time it's called.
* **[`.note(text)`](#notetext)**
	* Display a prominent note to the user.
* **[`.info(text)`](#infotext)**
	* Print some basic text out to the user.
* **[`.generate([callback])`](#generatecallback)**
	* Run all steps with an optional callback.
* **[`.transform(transformingFunction)`](#transformtransformingfunction)**
	* Transform all answers according to a strategy.
	* Useful for casting values to their native datatypes.
* **[`.test`](#test)**
	* Automatically setup stimpak for testing.
	* Creates a temporary directory and sets it as the `.destination`.
* **[`.report`](#report)**
	* Get detailed information about what happened during a `.generate` call.
* **[`.report.diffFixtures(fixturesDirectoryPath)`](#reportdifffixturesfixturesdirectorypath)**
	* Get an object that shows the differences between actual output and fixtures representing expected output.
	* Very useful for testing generators.

---

## `.answers([object])`

Templates and functions use `.answers()` for placeholder values that can be used to render out files, provide commands with arguments, and more.

**Zero or One Argument:**

1. `object` (optional)
	* If `object` is provided, it will merge all of the provided answers with the existing answers.
	* If `object` is not provided, it will return all existing answers.

**Example:**

``` javascript
stimpak
.answers({
	firstName: "Bob",
	lastName: "Belcher"
})
.answers({
	lastName: "Builder"
});

stimpak.answers(); // { firstName: "Bob", lastName: "Builder" }
```

[Back to Table of Contents](#method-guide)

---

## `.prompt(...promptObjects)`

You can let the user set values in `.answers()` by using `.prompt()` to ask questions on the command-line.

**Prompts are [`inquirer.js`](https://github.com/SBoudrias/Inquirer.js)-style with just two key differences:**

1. Prompt answers are available on `stimpak.answers()` immediately after each prompt.
2. `when` functions are provided the stimpak object as the first argument instead of an answers object.
	* You can still access all answers from `stimpak.answers()`:

**Takes One or More Arguments:**

1. **`...promptObjects`**

	One or more `promptObjects` must be provided, else nothing will happen.

	* **`promptObject`**
		* **type** (String)
			Type of the prompt. Defaults: `input` - Possible values: `input`, `confirm`,
		`list`, `rawlist`, `expand`, `checkbox`, `password`, `editor`

		* **name** (String)
			The name to use when storing the answer in the answers hash.

		* **message** (String|Function)
			The question to print. If defined as a function, the first parameter will be the current instance of stimpak.

		* **default** (String|Number|Array|Function)
			Default value(s) to use if nothing is entered, or a function that returns the default value(s). If defined as a function, the first parameter will be the current instance of stimpak.

		* **choices** (Array|Function)
			Choices array or a function returning a choices array. If defined as a function, the first parameter will be the current instance of stimpak.
			Array values can be simple `strings`, or `objects` containing a `name` (to display in list), a `value` (to save in the answers hash) and a `short` (to display after selection) properties.

		* **validate** (Function)
			Receive the user input and should return `true` if the value is valid, and an error message (`String`) otherwise. If `false` is returned, a default error message is provided.

		* **filter** (Function)
			Receive the user input and return the filtered value to be used inside the program. The value returned will be added to the _Answers_ hash.

		* **when** (Function, Boolean)
			Receive the current instance of stimpak and return `true` or `false` depending on whether or not this question should be asked. The value can also be a simple boolean.

**Types of Prompts:**

* **`confirm`**

	When you want to get a boolean (yes or no) response from the user.

	``` javascript
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
	```

* **`input`**

	When you want a typed string response from the user.

	``` javascript
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
	```

* **`password`**

	When you want the user to input a string without the value being visible on their screen.

	``` javascript
	stimpak
	.prompt({
		type: "password",
		name: "pass",
		message: "Please type your password:"
	})
	.then(stim => {
		stim.answers().pass; // String
	});
	```

* **`list`**

	When you want the user to choose one value from a list.

	``` javascript
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
	```

* **`checkbox`**

	When you want the user to choose multiple values from a list.

	``` javascript
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
	```

* **`expand`**

	When you want the user to quickly choose one choice from a list by specific keys

	``` javascript
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
	```

* **`editor`**

	Launches an instance of the users preferred editor on a temporary file. Once the user exits their editor, the contents of the temporary file are read in as the result. The editor to use is determined by reading the $VISUAL or $EDITOR environment variables. If neither of those are present, notepad (on Windows) or vim (Linux or Mac) is used.

	``` javascript
	stimpak
	.prompt({
		type: "editor",
		name: "fileContents",
		message: "Please write a short bio of at least 3 lines:",
		validate: value => {
			let returnValue = true;

			if (value.split("\n").length < 3) {
				returnValue = "Must be at least 3 lines.";
			}

			return returnValue;
		}
	})
	.then(stim => {
		stim.answers().fileContents; // String
	});
	```

[Back to Table of Contents](#method-guide)

---

## `.use(...GeneratorConstructors)`

You can use other stimpak generators in another by providing `.use` with its Constructor function.

* All features of the generator will be seamlessly added to the current generator.
* Only the first `.title` call will be shown, all subsequent `.title` calls will be ignored.
	* You can get around this behavior by using the `.subtitle` method, which is identical except it will always be shown.

**Takes One or More Arguments:**

1. `...GeneratorConstructors`
	One or more `GeneratorConstructors`, which are just simple constructors that defines a single `.setup` hook.

**Example:**

``` javascript
import StimpakNpm from "stimpak-npm";
import StimpakTestDriven from "stimpak-test-driven";

stimpak
.use(
	StimpakNpm,
	StimpakTestDriven
)
.then(this.showAnswers);

function showAnswers(stimpak) {
	stimpak.answers(); // All answers from stimpak-npm and stimpak-test-driven
}
```

[Back to Table of Contents](#method-guide)

---

## `.destination(directoryPath)`

**Notes:**

* You won't need to use this method unless you're doing a library-level integration with stimpak. `.destination` is set automatically in the CLI. That said, if you want to integrate with stimpak on a library-level, you will need to call `.destination` or `.render` calls will return an error in the callback.
* `.destination` is automatically set to a temporary directory when `.test` is called. See the `.test` docs for more details.

**One Argument:**

1. **`directoryPath`**
	An absolute path to the output directory where rendered files should go.

**Example:**

``` javascript
stimpak
.destination(process.cwd());
```

[Back to Table of Contents](#method-guide)

---

## `.render(globString, [templateDirectoryPath])`

Stimpak uses `underscore`-style templates to render files using the answers set.

**Takes Two Arguments:**

1. **`globString`**
	* This should be a [glob](https://github.com/isaacs/node-glob) string that matches filepaths within the provided `templateDirectory`.
2. **`templateDirectory`**
	* This should be an absolute path to the directory that holds the templates.

**Examples:**

* **Templates can interpolate answer values by wrapping them in `<%= … %>`**

	1. **generator.js**
		``` javascript
		stimpak
		.answers({
			pageTitle: "Hello, World!",
			pageContent: "How ya doin'?!"
		})
		.render("**/*", `${__dirname}/myTemplatesDirectory`);
		```

	2. **myTemplatesDirectory/index.html**
		``` html
		<html>
		<head>
			<title><%= pageTitle %></title>
		</head>
		<body>
			<%= pageContent %>
		</body>
		</html>
		```

	3. **destination/index.html**

		``` html
		<html>
		<head>
			<title>Hello, World!</title>
		</head>
		<body>
			How ya doin'?!
		</body>
		</html>
		```
* **Templates can execute arbitrary JavaScript code by wrapping it in `<% … %>`**

	**Note:** At this time, templates can only use `ES5`-compatible code in them.

	1. **generator.js**
		``` javascript
		stimpak
		.answers({
			choices: ["red", "green", "blue"]
		})
		.render("**/*", `${__dirname}/myTemplatesDirectory`);
		```

	2. **myTemplatesDirectory/index.html**
		``` html
		<html>
		<head>
			<title><%= pageTitle %></title>
		</head>
		<body>
			<select><% choices.forEach(function (choice) { %>
				<option value="<%= choice %>"><%= choice %></option><% }); %>
			</select>
		</body>
		</html>
		```

	3. **destination/index.html**

		``` html
		<html>
		<head>
			<title>Hello, World!</title>
		</head>
		<body>
			<select>
				<option value="red">red</option>
				<option value="green">green</option>
				<option value="blue">blue</option>
			</select>
		</body>
		</html>
		```

* **You can interpolate an answer value and have it be HTML-escaped by wrapping it in `<%- … %>`**

[Back to Table of Contents](#method-guide)

---

## `.merge(globString, [mergeStrategyFunction])`

* Provide a [glob string](https://github.com/isaacs/node-glob) to match against file paths set with `.render`.
* (Optionally) provide a custom merge strategy function.
	* **If provided**, the merge strategy function will be used as the merge strategy.
	* **If not provided**, stimpak will use either a simple JSON or text merging strategy depending on whether both files are detected as JSON.

**Takes One or Two Arguments:**

1. **`globString`**
	* This should be a [glob](https://github.com/isaacs/node-glob) string that matches filepaths set by `.render`.
2. **`[mergeStrategyFunction(stimpak, newFile, oldFile, callback)]`**
	1. **`stimpak`**
		The current instance of stimpak.
	2. **`newFile`**
		A [Vinyl file](https://github.com/gulpjs/vinyl) representing the newly rendered file.
	3. **`oldFile`**
		A [Vinyl file](https://github.com/gulpjs/vinyl) representing the file that already exists in the destination directory.
	4. **`callback(error, mergedFile)`**
		A node-standard callback that accepts two arguments:
		1. `error`
			If there's an error during merging, return it here. Else, return something falsy.
		2. `mergedFile`.
			A required [Vinyl-compatible file](https://github.com/gulpjs/vinyl) representing the final merged file that should overwrite the existing file.

**Merge Strategy Functions:**

Each merge strategy is a function that accepts 4 mandatory arguments:



**Example:**

``` javascript
stimpak.merge("important.txt", keepOldFile);

function keepOldFile(stimpak, newFile, oldFile, callback) {
	callback(null, oldFile);
}
```

[Back to Table of Contents](#method-guide)

---

## `.command(commandString, [outputHandlerFunction])`

* Call a shell command via child-process.
* (*Optionally*) Provide an output handler function that handles the command's `stdout` and `stderr` values.
	* **If provided**, `outputHandlerFunction` will be called directly after the command has finished execution, then proceed to the next step.
	* **If not provided**, stimpak will immediately move on to the next step.

**Takes One or Two Arguments:**

1. **`commandString`**
	* The full shell command complete with all arguments you would like to execute.
2. **`[outputHandlerFunction(stimpak, stdout, stderr, [callback])]`**
	1. **`stimpak`**
		The current instance of stimpak.
	2. **`stdout`**
		The resulting `stdout` from the command run.
	3. **`stderr`**
		The resulting `stderr` from the command run.
	4. **`[callback(error)]`**
		Optional node-standard callback that accepts one argument:
		1. `error`
			If there's an error handling the output, return it here. Else, return something falsy.



**Example:**

``` javascript
stimpak.command("echo 'Hello, World!'", handleOutput);

function handleOutput(stimpak, stdout, stderr) {
	stdout; // "Hello, World!"
	stderr; // ""
}
```

[Back to Table of Contents](#method-guide)

---

## `.title(text, [figletFontName])`

* Display text to the user using figlet ASCII fonts.
* **Note:** `.title` only works once! All subsequent calls to `.title` will be ignored. If you want a title that shows every time, use the identical method `.subtitle`.

**Takes One or Two Arguments:**

1. **`text`**
	* The text you want rendered into a figlet font.
2. **`[figletFontName = "standard"]`**
	* **If not provided**, the "standard" figlet font will be used.
	* **If provided**, `text` will be rendered with the figlet font designated.
	* There are `680` fonts available. [Click here to see a list.](./figlet-fonts)

**Example:**

``` javascript
stimpak
.title("DOOM", "doom")
.generate(error => {
	// All done here.
});
```

``` shell
______  _____  _____ ___  ___
|  _  \|  _  ||  _  ||  \/  |
| | | || | | || | | || .  . |
| | | || | | || | | || |\/| |
| |/ / \ \_/ /\ \_/ /| |  | |
|___/   \___/  \___/ \_|  |_/
```

[Back to Table of Contents](#method-guide)

---

## `.subtitle(text, [figletFontName])`

* Display text to the user using figlet ASCII fonts.
* **Note:** `.subtitle` will show every time its called. If you want only *one* title at the top of your compound generators, and an individual title for each sub generator that doesn't show when they are used via `.use`, you will want to use `.title` which only displays text the first time it's called and ignored after that.

**Takes One or Two Arguments:**

1. **`text`**
	* The text you want rendered into a figlet font.
2. **`[figletFontName = "standard"]`**
	* **If not provided**, the "standard" figlet font will be used.
	* **If provided**, `text` will be rendered with the figlet font designated.
	* There are `680` fonts available. [Click here to see a list.](./figlet-fonts)

**Example:**

``` javascript
stimpak
.subtitle("Star", "starwars")
.subtitle("Wars", "starwars")
.generate(error => {
	// All done here.
});
```

``` shell
     _______..___________.     ___      .______
    /       ||           |    /   \     |   _  \
   |   (----``---|  |----`   /  ^  \    |  |_)  |
    \   \        |  |       /  /_\  \   |      /
.----)   |       |  |      /  _____  \  |  |\  \----.
|_______/        |__|     /__/     \__\ | _| `._____|
____    __    ____      ___      .______           _______.
\   \  /  \  /   /     /   \     |   _  \         /       |
 \   \/    \/   /     /  ^  \    |  |_)  |       |   (----`
  \            /     /  /_\  \   |      /         \   \
   \    /\    /     /  _____  \  |  |\  \----..----)   |
    \__/  \__/     /__/     \__\ | _| `._____||_______/
```

[Back to Table of Contents](#method-guide)

---

## `.note(text)`

* Display some framed text to the user.

**Takes One Arguments:**

1. **`text`**
	* The text you want framed and shown to the user.

**Example:**

``` javascript
stimpak
.note("Hello!");
```

``` shell
+--------+
| Hello! |
+--------+
```

[Back to Table of Contents](#method-guide)

---

## `.info(text)`

* Display some basic text to the user.

**Takes One Arguments:**

1. **`text`**
	* The text you want shown to the user.

**Example:**

``` javascript
stimpak
.info("Hello!");
```

``` shell
Hello!
```

[Back to Table of Contents](#method-guide)

---

## `.transform(transformingFunction)`

* Transform all answers from one data type to another.
* Can also be used to easily cast numerical strings into integers.

**Takes One Arguments:**

1. **`text`**
	* The text you want shown to the user.

**Example:**

``` javascript
stimpak
.info("Hello!");
```

``` shell
Hello!
```

[Back to Table of Contents](#method-guide)

---

## `.generate([callback])`

* Run each designated step in order.
* (*Optionally*) Provide a callback to process any errors returned.

**Takes Zero or One Argument:**

1. **`[callback([error])]`**
	1. **`[error]`**
		If there's an error at any time during generation, the steps will be halted and the error will be returned here.

**Example:**

``` javascript
stimpak
.destination(process.cwd())
.render("**/*", `${__dirname}/templates`)
.generate(error => {
	// All done here.
});
```

[Back to Table of Contents](#method-guide)

---

## `.test`

* Automatically setup stimpak for testing by creating a temporary directory and setting it as the `.destination`.

**Example:**

``` javascript
stimpak
.test
.render("**/*", `${__dirname}/templates`)
.generate(error => {
	stimpak.destination(); // /some/temp/directory
});
```

[Back to Table of Contents](#method-guide)

---

## `.report`

* Detailed information about what happened during a `.generate` call.
* Returns information on all events and files generated.

**Event Types:**

* `writeFile`
* `mergeFile`
* `writeDirectory`
* `command`

**Example:**

``` javascript
stimpak
.test
.render("**/*", `${__dirname}/templates`)
.generate(error => {
	stimpak.report.events;
	/*
	{
		type: "writeFile",
		path: "/destination-directory/test.js",
		templatePath: "/generator-directory/templates/test.js",
		content: "Hello, World!"
	}
	 */

	stimpak.report.files;
	/*
	{
		"/outputDirectory/test.js": "Hello, World!"
	}
	 */

	stimpak.report.files["/outputDirectory/test.js"].should.eql("Hello, World!");
});
```

[Back to Table of Contents](#method-guide)

---

## `.report.diffFixtures(fixturesDirectoryPath)`

* Get detailed information about the differences between files in the `.destination` directory, and files in a fixtures directory.
* Returns information on actual vs expected `paths` and `content`.
* `content` returns a blank object when there are no differences, so it's easy to setup content testing for all of your files with a single command chain:
	``` javascript
	stimpak
	.report
	.diffFixtures(fixturesDirectoryPath)
	.content.should.eql({});
	```

**Takes One Argument:**

1. **`fixturesDirectoryPath`**
	Absolute path to a directory that contains files that you'd like to compare with the files found in the `.destination` directory.

**Example:**

``` javascript
stimpak
.test
.render("**/*", `${__dirname}/templates`)
.generate(error => {
	const differences = stimpak.report.diffFixtures(`${__dirname}/fixtures`);
	/*
	{
		paths: {
			actual: [ ... ],
			expected: [ ... ]
		},
		content: {
			[fileNameHere]: {
				actual: "...",
				expected: "..."
			}
		}
	}
	*/
	differences.content.should.eql({});
});
```

[Back to Table of Contents](#method-guide)

---
