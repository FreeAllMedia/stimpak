import Template from "../../lib/template/template.js";
import temp from "temp";
import templateSystem from "fs";

temp.track();

xdescribe("template.merge()", () => {
	let template,
			path,
			content,
			renderedContent,
			temporaryDirectory;

	beforeEach(done => {
		temporaryDirectory = temp.mkdirSync("Template.render");
		path = `${temporaryDirectory}/template.txt`;
		content = "Hello, World!";
		template = new Template(path, content);
		mergeStrategy = (oldFile, newFile, mergeComplete) => {
			oldFile.contents += newFile.contents;
			mergeComplete(null, oldFile);
		};
		template.render(error => {
			renderedContent = templateSystem.readFileSync(path, { encoding: "utf8" });
			done(error);
		});
	});

	it("should render the template contents to the designated path", () => {
		renderedContent.should.eql(content);
	});

	it("should return `this` to allow chaining", () => {
		template.render(() => {}).should.eql(template);
	});
});
