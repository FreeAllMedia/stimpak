import Template from "../../lib/template/template.js";
import temp from "temp";
import templateSystem from "fs";

temp.track();

describe("template.engine() (default)", () => {
	let path,
			content,
			renderedContent,
			temporaryDirectory;

	beforeEach(done => {
		temporaryDirectory = temp.mkdirSync("Template.engine");

		path = `${temporaryDirectory}/template.txt`;
		content = "Hello, <%= foo %>!";

		new Template()
		.content(content)
		.values({
			"foo": "World"
		})
		.render(path, error => {
			renderedContent = templateSystem.readFileSync(path, { encoding: "utf8" });
			done(error);
		});
	});

	it("should render the template contents using the designated engine", () => {
		renderedContent.should.eql("Hello, World!");
	});
});
