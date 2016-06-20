import ascii from "ascii-art";
import privateData from "incognito";

ascii.Figlet.fontPath = `${__dirname}/../../../figlet-fonts/`;

export default function title(message = "Title", figletFont = "Standard") {
	this.debug("title", message);

	const needsLineBreak = Boolean(privateData(this).needsLineBreak);

	this.then((stimpak, done) => {
		if (needsLineBreak) {
			process.stdout.write("\n");
		}

		ascii.font(message, figletFont, renderedMessage => {
			process.stdout.write(renderedMessage);
			done();
		});
	});

	return this;
}
