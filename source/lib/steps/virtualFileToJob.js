import path from "path";

export default function virtualFileToJob(filePath, fileContents, done) {
	const base = path.dirname(filePath) + "/";
	const fileName = path.basename(filePath);

	const jobs = [{
		base: base,
		name: fileName,
		path: filePath,
		contents: fileContents
	}];

	done(null, jobs);
}
