import privateData from "incognito";
import newTemplate from "lodash.template";
import fileSystem from "fs";

export default function note(message) {
	this.debug("note", message);

	const templateContents = fileSystem.readFileSync(`${__dirname}/../cli/templates/note.txt`);
	const template = newTemplate(templateContents);
	const renderedNote = template({
		message
	});

	const _ = privateData(this);
	_.action
		.step((stimpak, done) => {
			this.write(`\n${renderedNote}`);
			done();
		});
	return this;
}
