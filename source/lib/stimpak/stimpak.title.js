import ascii from "ascii-art";
import privateData from "incognito";

ascii.Figlet.fontPath = `${__dirname}/../../figlet-fonts/`;

export default function title(message = "Title", figletFont = "standard") {
	this.debug("title", message, figletFont);

	const _ = privateData(this);

	if (!_.titleShown) {
		_.titleShown = true;
		this.then((stimpak, done) => {
			ascii.font(message, figletFont, renderedMessage => {
				this.write(`\n${renderedMessage}`);
				done();
			});
		});
	}

	return this;
}
