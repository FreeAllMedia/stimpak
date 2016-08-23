export default function fileNamesToVirtualFiles(directoryPath, fileNames, stepDone) {
	const files = [];

	fileNames.forEach(fileName => {
		files.push({
			directoryPath,
			name: fileName,
			path: `${directoryPath}/${fileName}`
		});
	});

	stepDone(null, files);
}
