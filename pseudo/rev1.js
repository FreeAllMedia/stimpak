// CLI
generator advanced-project









// CLI Code
import Stimpak from "stimpak";
import AdvancedProjectGenerator from "stimpak-advanced-project";

const generator = new Stimpak().use(AdvancedProjectGenerator);

generator.generate(error => {
	if (error) { throw error; }
});

const callFunction = Symbol();










// Library
class Generator {
	constructor() {
		this.inquirer = new Inquirer();
		this.answers = {};
		this.action = new StairCase(this.answers);
	}

	use() {}

	then(theFunction) {
		this.action.step(theFunction);
		return this;
	}

	prompt(promptArray) {
		this.action.step((answers, callback) => {
			this.promptly
				.prompt(promptArray)
				.then(answers => {
					for (let answerName in answers) {
						const answerValue = answers[answerName];
						this.answers[answerName] = answerValue;
					}
					callback();
				});
		});

		return this;
	}

	writeFiles(templateDirectoryPath, destinationDirectoryPath) {
		const templateFilePaths = glob.sync(`${templateDirectoryPath}/**/*`);

		this.action.step((generator, done) => {
			templateFilePaths.forEach(templateFilePath => {
				let destinationFilePath = templateFilePath;
				let templateFileContents = fileSystem.readFileSync(templateFilePath);

				for (let answerName in answers) {
					let answerValue = answers[answerName];
					const answerRegularExpression = new RegExp(`##${answerName}##`, "g");
					destinationFilePath.replace(answerRegularExpression, answerValue);
				}

				const context = Object.assign({}, this.answers);
				const fileTemplate = _.template(templateFileContents);
				const renderedFileContents = fileTemplate(context);

				fileSystem.writeFileSync(destinationFilePath, renderedFileContents);
			});
			done();
		});

		return this;
	}

	command() {}

	generate(callback) {
		this.action
			.results(callback);
	}
}









// Plugin Extending
class Plugin extends AdvancedProjectGenerator {
	initialize(stimpak) {
		stimpak.use(PackageJsonGenerator);

		const preWritePrompts = [
			{
				type: "input",
				name: "something",
				message: "Type in something:",
				default: "blahhhhh"
			},
			{
				type: "confirm",
				name: "somethingElse",
				message: "You want something else?",
				default: true
			}
		];

		const postWritePrompts = [
			{
				type: "confirm",
				name: "installNpm",
				message: "Do you want to install the npm packages?",
				default: true
			}
		];

		stimpak
			.prompt(preWritePrompts)
			.then(this.write)
			.prompt(postWritePrompts)
			.then(this.install);
	}

	write(stimpak, done) {
		stimpak
			.merge(
				"package.json",
				(stimpak, newFile, oldFile, done) => {
					const newPackageJson = JSON.parse(newFile.contents);
					const oldPackageJson = JSON.parse(oldFile.contents);

					done(null, oldFile);
				})
			.source("**/*.json")
				.directory("/some/source/")
				.basePath("/some/other/destination/subpath")
			.then(done);
	}

	install(stimpak, done) {
		stimpak
			.command("npm install --save", (stdout, stderr, commandDone) => {
				// optional
				commandDone();
			})
			.then(done);
	}
}
