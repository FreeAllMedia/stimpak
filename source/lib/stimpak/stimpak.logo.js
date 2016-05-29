import privateData from "incognito";
import newTemplate from "lodash.template";
import fileSystem from "fs";

export default function logo(message = "") {
	const templateContents = fileSystem.readFileSync(`${__dirname}/../cli/templates/logo.txt`);
	const template = newTemplate(templateContents);
	const renderedNote = template({
		message
	});

	const _ = privateData(this);
	_.action
		.step((stimpak, done) => {
			process.stdout.write(renderedNote);
			done();
		});
	return this;
}
