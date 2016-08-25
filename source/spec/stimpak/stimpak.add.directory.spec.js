import Stimpak from "../../lib/stimpak/stimpak.js";
import fileSystem from "fs";

describe("stimpak.add(path, [contents]) (directory)", () => {
	let stimpak,
			path;

	beforeEach(done => {
		path = "letters";

		stimpak = new Stimpak().test;

		stimpak
		.add(path)
		.generate(done);
	});

	it("should render a directory with the path provided", () => {
		fileSystem.statSync(`${stimpak.destination()}/${path}`).isDirectory().should.be.true;
	});

	it("should not render the file before .generate is called", () => {
		stimpak = new Stimpak().test
		.add(path);

		fileSystem.existsSync(`${stimpak.destination()}/${path}`).should.be.false;
	});
});
