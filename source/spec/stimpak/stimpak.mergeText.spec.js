import Stimpak from "../../lib/stimpak/stimpak.js";
import File from "vinyl";

describe("stimpak.mergeText()", () => {
	let stimpak,
			oldText,
			newText,
			newFile,
			oldFile,
			expectedMergedText;

	beforeEach(() => {
		stimpak = new Stimpak();

		oldText = "stimpak.test;\nstimpak.title('blah');\nstimpak.render()";
		newText = "stimpak.test;\nstimpak.subtitle('halb');\nstimpak.render(this)";

		expectedMergedText = "stimpak.test;\nstimpak.subtitle(\'halblah\');\nstimpak.render(this)";

		newFile = new File({
			contents: new Buffer(newText)
		});

		oldFile = new File({
			contents: new Buffer(oldText)
		});
	});

	it("should merge two text files and return the merged file via the callback", done => {
		stimpak.mergeText(stimpak, newFile, oldFile, (error, mergedFile) => {
			mergedFile.contents.toString().should.eql(expectedMergedText);
			done();
		});
	});
});
