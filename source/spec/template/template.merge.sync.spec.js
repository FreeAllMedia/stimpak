import Template from "../../lib/template/template.js";
import temp from "temp";
import fileSystem from "fs";

temp.track();

describe("template.merge() (sync)", () => {
	let template,
			path,
			content,
			existingContent,
			mergeStrategy,
			renderedContent,
			temporaryDirectory;

	beforeEach(done => {
		temporaryDirectory = temp.mkdirSync("Template.render");

		path = `${temporaryDirectory}/template.txt`;
		existingContent = "Hello, World!";
		content = "Hello, Bob!";
		template = new Template();

		fileSystem.writeFileSync(path, existingContent);

		mergeStrategy = (self, oldContent, newContent) => {
			const mergedContent = oldContent + newContent;
			return mergedContent;
		};

		template
		.content(content)
		.merge(mergeStrategy)
		.render(path, error => {
			renderedContent = fileSystem.readFileSync(path, { encoding: "utf8" });
			done(error);
		});
	});

	it("should render the template contents to the designated path", () => {
		renderedContent.should.eql(existingContent + content);
	});

	it("should return `this` to allow chaining", () => {
		template.merge(mergeStrategy).should.eql(template);
	});

	it("should overwrite the previous strategy when a new strategy is provided", () => {
		const newStrategy = () => {};
		template.merge(newStrategy);
		template.merge().should.eql(newStrategy);
	});

	it("should catch thrown errors and bubble them up to the callback", done => {
		/* eslint-disable no-unused-vars */
		const expectedError = new Error("Something went wrong!");

		new Template()
		.content(content)
		.merge((self, oldContent, newContent) => {
			throw expectedError;
		})
		.render(path, error => {
			error.should.eql(expectedError);
			done();
		});
	});

	it("should return an error when the merge strategy has less than 3 arguments", done => {
		new Template()
		.content(content)
		.merge(() => {})
		.render(path, error => {
			error.message.should.eql("Merge stategies must have either 3 or 4 arguments.");
			done();
		});
	});
});
