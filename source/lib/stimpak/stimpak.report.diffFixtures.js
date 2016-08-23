import glob from "glob";
import fileSystem from "fs";
import sortByLength from "../sorters/sortByLength.js";

export default function diffFixtures(fixturesDirectoryPath) {
	const fixtureFilePaths = glob.sync("**/*", { cwd: fixturesDirectoryPath, dot: true }).sort(sortByLength);

	const reportFilePaths = Object.keys(this.report.files).map(filePath => {
		return filePath.replace(`${this.destination()}/`, "");
	});

	const differences = {
		paths: {
			actual: reportFilePaths,
			expected: fixtureFilePaths
		},
		contents: {}
	};

	fixtureFilePaths.forEach(fixtureFilePath => {
		const fileReport = this.report.files[`${this.destination()}/${fixtureFilePath}`];

		if (fileReport && !fileReport.isDirectory) {
			const expectedContent = fileSystem.readFileSync(`${fixturesDirectoryPath}/${fixtureFilePath}`, { encoding: "utf-8" });
			const actualContent = fileSystem.readFileSync(fileReport.path, { encoding: "utf-8" });

			if (actualContent !== expectedContent) {
				differences.contents[fixtureFilePath] = {
					actual: actualContent,
					expected: expectedContent
				};
			}
		}
	});

	return differences;
}
