import ascii from "ascii-art";

ascii.Figlet.fontPath = `${__dirname}/../../figlet-fonts/`;

export default function subtitle(message = "Sub-Title", figletFont = "standard") {
	this.debug("subtitle", message, figletFont);

	this.then((stimpak, done) => {
		ascii.font(message, figletFont, renderedMessage => {
			this.write(`\n${renderedMessage}`);
			done();
		});
	});

	return this;
}
