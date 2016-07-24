import Template from "../../lib/template/template.js";
import temp from "temp";
import templateSystem from "fs";
import Handlebars from "handlebars";

temp.track();

describe("template.engine() (async)", () => {
	let template,
			path,
			content,
			engine,
			renderedContent,
			temporaryDirectory;

	beforeEach(done => {
		temporaryDirectory = temp.mkdirSync("Template.engine");

		path = `${temporaryDirectory}/template.txt`;
		content = "Hello, {{name}}!";

		engine = (self, complete) => {
			const handleBarsTemplate = Handlebars.compile(self.content());
			const renderedTemplate = handleBarsTemplate(self.values());
			complete(null, renderedTemplate);
		};

		template = new Template()
		.content(content)
		.values({
			"name": "World"
		})
		.engine(engine)
		.render(path, error => {
			renderedContent = templateSystem.readFileSync(path, { encoding: "utf8" });
			done(error);
		});
	});

	it("should render the template contents using the designated engine", () => {
		renderedContent.should.eql("Hello, World!");
	});

	it("should pass errors from the engine callback to the render callback", done => {
		const expectedError = new Error();

		template = new Template()
		.content(content)
		.values({
			"name": "World"
		})
		.engine((self, callback) => {
			callback(expectedError);
		})
		.render(path, error => {
			error.should.eql(expectedError);
			done();
		});
	});

	it("should return `this` to allow chaining", () => {
		template.engine(engine).should.eql(template);
	});
});
