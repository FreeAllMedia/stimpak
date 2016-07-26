import Template from "../../lib/template/template.js";
import temp from "temp";
import fileSystem from "fs";
import sinon from "sinon";

temp.track();

describe("template.difference() (sync)", () => {
	let template,
			path,
			content,
			existingContent,
			differenceStrategy,
			renderedContent,
			temporaryDirectory;

	beforeEach(done => {
		temporaryDirectory = temp.mkdirSync("Template.render");

		path = `${temporaryDirectory}/template.txt`;
		existingContent = "Hello, World!";
		content = "Hello, Bob!";
		template = new Template();

		fileSystem.writeFileSync(path, existingContent);

		differenceStrategy = sinon.spy((self, difference) => difference.value);

		template
		.content(content)
		.difference(differenceStrategy)
		.render(path, error => {
			renderedContent = fileSystem.readFileSync(path, { encoding: "utf8" });
			done(error);
		});
	});

	it("should render the template contents to the designated path", () => {
		renderedContent.should.eql("Hello, WorldBob!");
	});

	it("should return `this` to allow chaining", () => {
		differenceStrategy.calls.length.should.eql(3);
	});

	it("should overwrite the previous strategy when a new strategy is provided", () => {
		const newStrategy = () => {};
		template.difference(newStrategy);
		template.difference().should.eql(newStrategy);
	});

	it("should catch thrown errors and bubble them up to the callback", done => {
		/* eslint-disable no-unused-vars */
		const expectedError = new Error("Something went wrong!");

		new Template()
		.content(content)
		.difference((self, difference) => {
			throw expectedError;
		})
		.render(path, error => {
			error.should.eql(expectedError);
			done();
		});
	});
});
