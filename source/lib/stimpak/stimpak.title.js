import ascii from "ascii-art";

ascii.Figlet.fontPath = `${__dirname}/../../../figlet-fonts/`;

export default function title(message = "Title", figletFont = "standard") {
	this.debug("title", message);

	this.then((stimpak, done) => {
		ascii.font(message, figletFont, renderedMessage => {
			process.stdout.write(`\n${renderedMessage}`);
			done();
		});
	});

	return this;
}
