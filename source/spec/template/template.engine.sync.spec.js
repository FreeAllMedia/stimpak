import Template from "../../lib/template/template.js";
import temp from "temp";
import templateSystem from "fs";
import Handlebars from "handlebars";

temp.track();

describe("template.engine() (sync)", () => {
	let template,
			path,
			content,
			values,
			engine,
			renderedContent,
			temporaryDirectory;

	beforeEach(done => {
		temporaryDirectory = temp.mkdirSync("Template.engine");

		path = `${temporaryDirectory}/template.txt`;
		content = "Hello, {{name}}!";
		values = {
			"name": "World"
		};

		engine = self => {
			const handleBarsTemplate = Handlebars.compile(self.content());
			const renderedTemplate = handleBarsTemplate(self.values());
			return renderedTemplate;
		};

		template = new Template()
		.content(content)
		.values(values)
		.engine(engine)
		.render(path, error => {
			renderedContent = templateSystem.readFileSync(path, { encoding: "utf8" });
			done(error);
		});
	});

	it("should render the template contents using the designated synchronous engine", () => {
		renderedContent.should.eql("Hello, World!");
	});

	it("should return `this` to allow chaining", () => {
		template.engine(engine).should.eql(template);
	});

	it("should catch thrown errors", done => {
		const expectedError = new Error("Something went wrong!");

		template = new Template()
		.content(content)
		.values(values)
		.engine(() => {
			throw expectedError;
		})
		.render(path, error => {
			error.should.eql(expectedError);
			done();
		});
	});
});
