import Stimpak from "../../lib/stimpak/stimpak.js";
import temp from "temp";
import fileSystem from "fs";

describe("stimpak.add(path, [contents]) (absolute path file)", () => {
	let stimpak,
			path,
			contents,
			directoryPath;

	beforeEach(() => {
		stimpak = new Stimpak().test;

		directoryPath = temp.mkdirSync("stimpak.add.file.absolute");

		path = `${directoryPath}/letters/shapes.js`;
		contents = "export default function baz() {}\n";

		stimpak
		.add(path, contents);
	});

	describe("(before .generate is called)", () => {
		it("should not render the file before .generate is called", () => {
			fileSystem.existsSync(path).should.be.false;
		});
	});

	describe("(after .generate is called)", () => {
		beforeEach(done => {
			stimpak
			.generate(done);
		});

		it("should render a file with the path provided", () => {
			fileSystem.existsSync(path).should.be.true;
		});

		it("should render a file with the contents provided", () => {
			fileSystem.readFileSync(path, "utf8").should.eql(contents);
		});
	});
});
