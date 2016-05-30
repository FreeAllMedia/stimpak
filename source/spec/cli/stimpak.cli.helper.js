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

	paths.copyPaths.forEach(copyPath => {
		const copyFromPath = copyPath[0];
		const copyToPath = copyPath[1];
		fileSystem.copySync(copyFromPath, copyToPath);
	});

	rimraf.sync(paths.symlinkedSubgeneratorDirectoryPath);

	paths.symLinkPaths.forEach(symLinkPath => {
		const symLinkFromPath = symLinkPath[0];
		const symLinkToPath = symLinkPath[1];
		fileSystem.symlinkSync(symLinkFromPath, symLinkToPath);
	});

	const command = `node ${paths.stimpakCliPath}`;

	//console.log("TEMP DIRECTORY PATH", paths.temporaryDirectoryPath);

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
	paths.subGeneratorDirectoryPath = `${paths.workingGeneratorDirectoryPath}/node_modules/stimpak-subgenerator`;
	paths.errorGeneratorDirectoryPath =	`${paths.fixtureDirectoryPath}/stimpak-generator-error`;

	paths.temporaryNodeModulesDirectoryPath =	`${paths.temporaryDirectoryPath}/node_modules`;
	paths.temporarySubGeneratorDirectoryPath = `${paths.temporaryDirectoryPath}/stimpak-subgenerator`;
	paths.symlinkedSubgeneratorDirectoryPath = `${paths.temporaryDirectoryPath}/node_modules/stimpak-test-5/node_modules/stimpak-subgenerator`;

	paths.stimpakCliPath = `${paths.projectRootDirectoryPath}/es5/lib/cli/stimpak.cli.js`;

	paths.copyPaths = [
		[ paths.subGeneratorDirectoryPath, paths.temporarySubGeneratorDirectoryPath ],
		[ paths.workingGeneratorDirectoryPath, `${paths.temporaryNodeModulesDirectoryPath}/stimpak-test-1` ],
		[ paths.workingGeneratorDirectoryPath, `${paths.temporaryNodeModulesDirectoryPath}/stimpak-test-2` ],
		[ paths.errorGeneratorDirectoryPath, `${paths.temporaryNodeModulesDirectoryPath}/stimpak-test-3` ],
		[ paths.errorGeneratorDirectoryPath, `${paths.temporaryNodeModulesDirectoryPath}/stimpak-test-4` ],
		[ paths.workingGeneratorDirectoryPath, `${paths.temporaryNodeModulesDirectoryPath}/stimpak-test-5` ]
	];

	paths.symLinkPaths = [
		[ paths.temporarySubGeneratorDirectoryPath, paths.symlinkedSubgeneratorDirectoryPath ]
	];

	paths.globalGeneratorDirectoryPath = `${paths.globalNodeModulesDirectoryPath}/stimpak-00000`;
}
