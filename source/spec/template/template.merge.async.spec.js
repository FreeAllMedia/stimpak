import Template from "../../lib/template/template.js";
import temp from "temp";
import fileSystem from "fs";

temp.track();

describe("template.merge() (async)", () => {
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

		mergeStrategy = (self, oldContent, newContent, mergeComplete) => {
			const mergedContent = oldContent + newContent;
			mergeComplete(null, mergedContent);
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

	it("should return errors to the render callback", done => {
		const expectedError = new Error("Something went wrong!");

		new Template()
		.content(content)
		.merge((self, oldContent, newContent, mergeDone) => {
			mergeDone(expectedError);
		})
		.render(path, error => {
			error.should.eql(expectedError);
			done();
		});
	});
});
