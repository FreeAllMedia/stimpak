import fileSystem from "fs-extra";
import path from "path";
import temp from "temp";

export function setupCliEnvironment() {
	const temporaryDirectoryPath = temp.mkdirSync("stimpakgenerators");
	const projectRootPath = path.normalize(`${__dirname}/../../../`);
	const sourceDirectoryPath = `${projectRootPath}/source`;

	const fixtureDirectoryPath =
		`${sourceDirectoryPath}/spec/cli/fixtures`;
	const workingGeneratorDirectoryPath =
		`${fixtureDirectoryPath}/stimpak-generator`;
	const errorGeneratorDirectoryPath =
		`${fixtureDirectoryPath}/stimpak-generator-error`;

	const temporaryNodeModulesDirectoryPath =
		`${temporaryDirectoryPath}/node_modules`;
	const userProjectDirectoryPath =
		`${temporaryDirectoryPath}/userProject`;
	const userProjectNodeModulesDirectoryPath =
		`${userProjectDirectoryPath}/node_modules`;

	const stimpakCliPath =
		`${projectRootPath}/es5/lib/cli/stimpak.cli.js`;

	const symLinkPaths = [
		[ workingGeneratorDirectoryPath,
			`${temporaryNodeModulesDirectoryPath}/stimpak-test-1` ],
		[ workingGeneratorDirectoryPath,
			`${temporaryNodeModulesDirectoryPath}/stimpak-test-2` ],
		[ errorGeneratorDirectoryPath,
			`${temporaryNodeModulesDirectoryPath}/stimpak-test-3` ],
		[ errorGeneratorDirectoryPath,
			`${userProjectNodeModulesDirectoryPath}/stimpak-test-4` ]
	];

	fileSystem.mkdirSync(temporaryNodeModulesDirectoryPath);
	fileSystem.mkdirSync(userProjectDirectoryPath);
	fileSystem.mkdirSync(userProjectNodeModulesDirectoryPath);

	symLinkPaths.forEach(paths => {
		const symLinkFromPath = paths[0];
		const symLinkToPath = paths[1];
		symLink(symLinkFromPath, symLinkToPath);
	});

	const command = `node ${stimpakCliPath}`;

	return {
		temporaryDirectoryPath,
		userProjectDirectoryPath,
		command
	};
}

function symLink(sourceDirectoryPath, destinationDirectoryPath) {
	try {
		fileSystem.unlinkSync(destinationDirectoryPath);
	} catch (ex) {
		// nop
	}

	fileSystem.symlinkSync(sourceDirectoryPath, destinationDirectoryPath);
}
