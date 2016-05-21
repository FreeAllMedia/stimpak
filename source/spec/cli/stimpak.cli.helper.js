import fileSystem from "fs-extra";
import path from "path";
import temp from "temp";
import rimraf from "rimraf";
import {
		exec as runCommand
} from "child_process";

export function setupCliEnvironment(callback) {
	runCommand("npm config get prefix", (error, stdout) => {
		const globalNodeModulesDirectoryPath =
			stdout
				.toString()
				.replace(/[\n\r]/, "/lib/node_modules");

		const environmentOptions = setupEnvironment(globalNodeModulesDirectoryPath);

		callback(null, environmentOptions);
	});
}

function setupEnvironment(globalNodeModulesDirectoryPath) {
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
			`${temporaryNodeModulesDirectoryPath}/stimpak-test-4` ]
	];

	const globalGeneratorDirectoryPath = `${globalNodeModulesDirectoryPath}/stimpak-00000`;
	rimraf.sync(globalGeneratorDirectoryPath);

	fileSystem.copySync(
		workingGeneratorDirectoryPath,
		globalGeneratorDirectoryPath
	);

	fileSystem.mkdirSync(temporaryNodeModulesDirectoryPath);

	symLinkPaths.forEach(paths => {
		const symLinkFromPath = paths[0];
		const symLinkToPath = paths[1];
		symLink(symLinkFromPath, symLinkToPath);
	});

	const command = `node ${stimpakCliPath}`;

	return {
		temporaryDirectoryPath,
		globalNodeModulesDirectoryPath,
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
