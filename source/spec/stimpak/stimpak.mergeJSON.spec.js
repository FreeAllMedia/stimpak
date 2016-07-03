import Stimpak from "../../lib/stimpak/stimpak.js";
import File from "vinyl";

describe("stimpak.mergeJSON()", () => {
	let stimpak,
			newJSON,
			oldJSON,
			newFile,
			oldFile,
			expectedMergedJSON;

	beforeEach(() => {
		stimpak = new Stimpak();

		newJSON = {
			abc: 321,
			object: {
				name: "Linda"
			},
			array: [
				4,
				5,
				6
			]
		};

		oldJSON = {
			123: "abc",
			abc: 123,
			object: {
				name: "Bob"
			},
			array: [
				1,
				2,
				3
			]
		};

		expectedMergedJSON = {
			123: "abc",
			abc: 321,
			object: {
				name: "Linda"
			},
			array: [
				1,
				2,
				3,
				4,
				5,
				6
			]
		};

		newFile = new File({
			contents: new Buffer(JSON.stringify(newJSON))
		});

		oldFile = new File({
			contents: new Buffer(JSON.stringify(oldJSON))
		});
	});

	it("should merge two JSON files and return the merged file via the callback", done => {
		stimpak.mergeJSON(stimpak, newFile, oldFile, (error, mergedFile) => {
			JSON.parse(mergedFile.contents.toString()).should.eql(expectedMergedJSON);
			done();
		});
	});
});
