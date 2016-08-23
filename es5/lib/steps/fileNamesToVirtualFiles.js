"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = fileNamesToVirtualFiles;
function fileNamesToVirtualFiles(directoryPath, fileNames, stepDone) {
	var files = [];

	fileNames.forEach(function (fileName) {
		files.push({
			directoryPath: directoryPath,
			name: fileName,
			path: directoryPath + "/" + fileName
		});
	});

	stepDone(null, files);
}