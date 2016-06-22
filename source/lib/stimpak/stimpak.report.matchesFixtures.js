import glob from "glob";
import fileSystem from "fs";

export default function matchesFixtures(fixturesDirectoryPath) {
	const fixtureFilePaths = glob.sync("**/*", { cwd: fixturesDirectoryPath, dot: true });

	const reportFilePaths = Object.keys(this.report.files).map(filePath => {
		return filePath.replace(`${this.destination()}/`, "");
	});

	let match = true;

	fixtureFilePaths.forEach(fixtureFilePath => {
		const fileExists = reportFilePaths.indexOf(fixtureFilePath) !== -1;

		if (fileExists) {
			const fileReport = this.report.files[`${this.destination()}/${fixtureFilePath}`];
			if (!fileReport.isDirectory) {
				const expectedContent = fileSystem.readFileSync(`${fixturesDirectoryPath}/${fixtureFilePath}`, { encoding: "utf-8" });
				const actualContent = fileSystem.readFileSync(fileReport.path, { encoding: "utf-8" });

				if (actualContent !== expectedContent) {
					match = false;
				}
			}
		} else {
			match = false;
		}
	});

	return match;
}
