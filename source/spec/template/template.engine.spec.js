import Template from "../../lib/template/template.js";
import temp from "temp";
import templateSystem from "fs";
import Handlebars from "handlebars";

temp.track();

describe("template.engine()", () => {
	let template,
			path,
			content,
			engine,
			renderedContent,
			temporaryDirectory;

	beforeEach(done => {
		temporaryDirectory = temp.mkdirSync("Template.engine");

		path = `${temporaryDirectory}/template.txt`;
		content = "Hello, {{foo}}!";

		engine = (self, complete) => {
			const handleBarsTemplate = Handlebars.compile(self.content());
			const renderedTemplate = handleBarsTemplate(self.values());
			complete(null, renderedTemplate);
		};

		template = new Template(path, content)
		.values({
			"foo": "World"
		})
		.engine(engine)
		.render(error => {
			renderedContent = templateSystem.readFileSync(path, { encoding: "utf8" });
			done(error);
		});
	});

	it("should render the template contents using the designated engine", () => {
		renderedContent.should.eql("Hello, World!");
	});

	it("should return `this` to allow chaining", () => {
		template.engine(engine).should.eql(template);
	});
});
