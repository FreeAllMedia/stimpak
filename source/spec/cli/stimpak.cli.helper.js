import fileSystem from "fs-extra";
import path from "path";
import temp from "temp";
import rimraf from "rimraf";
import {
		exec as runCommand
} from "child_process";

let paths = {};

export function setupCliEnvironment(callback) {
	runCommand("npm config get prefix", (error, stdout) => {
		paths.globalNodeModulesDirectoryPath =
			stdout
				.toString()
				.replace(/[\n\r]/, "/lib/node_modules");

		const environmentOptions = setupEnvironment();

		callback(null, environmentOptions);
	});
}

export function cleanEnvironment() {
	rimraf.sync(paths.globalGeneratorDirectoryPath);
}

function setupEnvironment() {
	setPaths();

	cleanEnvironment();

	fileSystem.mkdirsSync(paths.temporaryNodeModulesDirectoryPath);

	fileSystem.copySync(
		paths.workingGeneratorDirectoryPath,
		paths.globalGeneratorDirectoryPath
	);

	paths.symLinkPaths.forEach(symlinkPath => {
		const symLinkFromPath = symlinkPath[0];
		const symLinkToPath = symlinkPath[1];
		fileSystem.copySync(symLinkFromPath, symLinkToPath);
	});

	const command = `node ${paths.stimpakCliPath}`;

	return {
		temporaryDirectoryPath: paths.temporaryDirectoryPath,
		globalNodeModulesDirectoryPath: paths.globalNodeModulesDirectoryPath,
		command
	};
}

function setPaths() {
	paths.temporaryDirectoryPath = temp.mkdirSync("stimpakgenerators");
	paths.projectRootDirectoryPath = path.normalize(`${__dirname}/../../..`);
	paths.sourceDirectoryPath = `${paths.projectRootDirectoryPath}/source`;

	paths.fixtureDirectoryPath = `${paths.sourceDirectoryPath}/spec/cli/fixtures`;
	paths.workingGeneratorDirectoryPath =	`${paths.fixtureDirectoryPath}/stimpak-generator`;
	paths.errorGeneratorDirectoryPath =	`${paths.fixtureDirectoryPath}/stimpak-generator-error`;

	paths.temporaryNodeModulesDirectoryPath =	`${paths.temporaryDirectoryPath}/node_modules`;

	paths.stimpakCliPath = `${paths.projectRootDirectoryPath}/es5/lib/cli/stimpak.cli.js`;

	paths.symLinkPaths = [
		[ paths.workingGeneratorDirectoryPath, `${paths.temporaryNodeModulesDirectoryPath}/stimpak-test-1` ],
		[ paths.workingGeneratorDirectoryPath, `${paths.temporaryNodeModulesDirectoryPath}/stimpak-test-2` ],
		[ paths.errorGeneratorDirectoryPath, `${paths.temporaryNodeModulesDirectoryPath}/stimpak-test-3` ],
		[ paths.errorGeneratorDirectoryPath, `${paths.temporaryNodeModulesDirectoryPath}/stimpak-test-4` ]
	];

	paths.globalGeneratorDirectoryPath = `${paths.globalNodeModulesDirectoryPath}/stimpak-00000`;
}
