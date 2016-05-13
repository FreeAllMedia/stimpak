import suppose from "suppose";
import fileSystem from "fs";
import path from "path";

describe("(CLI) stimpak", () => {
	it("should return the help page when called without arguments", done => {
		const helpFileTemplatePath = path.normalize(`${__dirname}/../../lib/cli/templates/help.txt`);
		const expectedStdout = fileSystem.readFileSync(helpFileTemplatePath, { encoding: "utf-8" });

		let result = false;

		suppose("node stimpak", [])
			.when(expectedStdout, () => {
				result = true;
			})
			.on("error", done)
			.end(() => {
				result.should.be.true;
				done();
			});
	});

	it("should return the help page when called with the -h flag");
});
