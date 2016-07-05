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
* **[`.render(globString, [templateDirectoryPath])`](#renderglobstringtemplatedirectorypath)**
* **[`.merge(globString, [mergeStrategyFunction])`](#mergeglobstringmergestrategyfunction)**
	* Set a file to be merged instead of overwritten.
	* Use default strategies or provide a custom merge strategy function.
* **`.cast(castingFunction)`**
	* Cast answers to specific datatypes
* **`.context(object)`**
	* Set the context of subsequent `.then` calls.
* **`.command(commandString, [outputHandlerFunction])`**
	* Call a command via child-process.
	* *Optionally*: Provide an output handler function that handles the command's `stdout` and `stderr` values.
* **`.prompt()`**
* **`.generate()`**
* **`.note()`**
* **`.info()`**
* **`.title()`**
* **`.subtitle()`**
* **`.log()`**
* **`.debug()`**
* **`.test`**
* **`.report`**

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

## `.prompt(...promptObjects)`

You can let the user set values in `.answers()` by using `.prompt()` to ask questions on the command-line.

**Prompts are [`inquirer.js`](https://github.com/SBoudrias/Inquirer.js)-style with just two key differences:**

1. Prompt answers are available on `stimpak.answers()` immediately after each prompt.
2. `when` functions are provided the stimpak object as the first argument instead of an answers object.
	* You can still access all answers from `stimpak.answers()`:

**One or More Arguments:**

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

## `.use(...GeneratorConstructors)`

You can use other stimpak generators in another by providing `.use` with its Constructor function.

* All features of the generator will be seamlessly added to the current generator.
* Only the first `.title` call will be shown, all subsequent `.title` calls will be ignored.
	* You can get around this behavior by using the `.subtitle` method, which is identical except it will always be shown.

**One or More Arguments:**

1. `...GeneratorConstructors`
	One or more `GeneratorConstructors`, which are just simple constructors that defines a single `.setup` hook.

**Example:**

``` javascript
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

## `.render(globString, [templateDirectoryPath])`

Stimpak uses `underscore`-style templates to render files using the answers set.

**Two Arguments:**

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


## `.merge(globString, [mergeStrategyFunction])`

Merge with an existing file instead of overwriting it.

**One or Two Arguments:**

1. **`globString`**
	* This should be a [glob](https://github.com/isaacs/node-glob) string that matches filepaths set by `.render`.
2. **`mergeStrategyFunction`** (optional)
	* **If provided**, the merge strategy function will be used as the merge strategy.
	* **If not provided**, stimpak will use either a simple JSON or text merging strategy depending on whether both files are detected as JSON.

**Merge Strategy Functions:**

``` javascript
function mergeStrategy(stimpak, newFile, oldFile, callback) {
	stimpak; // The current instance of stimpak	newFile; // A Vinyl.js file representing the new file
	oldFile; // A Vinyl.js file representing the existing file
	callback(); // Standard node.js callback. Accepts an error as the first argument.
}

stimpak.merge("myFile.py", mergeStrategy);
```

**Example One:**

``` javascript
stimpak
.merge("package.json")
```

---

[Back to README.md](./README.md)
