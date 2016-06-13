import StimpakSandbox from "./stimpakSandbox.js";
import rimraf from "rimraf";

/**
 * This will create an environment that approximates
 * working conditions for stimpak generator developers:
 *
 * /local/stimpak-subgenerator
 * /local/stimpak-00000/node_modules/(stimpak-subgenerator)
 * ${globalNodeModulesDirectoryPath}/(stimpak-00000)/node_modules/(stimpak-subgenerator)
 * ${globalNodeModulesDirectoryPath}/(stimpak-00000)/node_modules/(stimpak-subgenerator)/node_modules/(stimpak-subgenerator-2)
 *
 * Note: portions of the path that are in parenthesis are symlinked.
 *
 * @class StimpakDevelopmentEnvironment
 * @extends Environment
 */
export default class StimpakDevelopmentEnvironment extends StimpakSandbox {
	configure() {
		this.setPaths();
		this.setFilesToCopy();
		this.setFilesToSymlink();
		this.setDirectoriesToMake();
	}

	setPaths() {
		const paths = this.paths();

		paths.fixtures.developmentSubgenerator =
			`${paths.fixtureDirectory}/stimpak-development-subgenerator`;

		paths.fixtures.developmentSubgenerator2 =
			`${paths.fixtureDirectory}/stimpak-development-subgenerator-2`;

		paths.fixtures.developmentGenerator =
			`${paths.fixtureDirectory}/stimpak-development-generator`;

		paths.localDirectory = `${paths.root}/local`;

		paths.localGeneratorDirectory =
			`${paths.localDirectory}/stimpak-00000`;

		paths.localSymlinkedSubgeneratorDirectory =
			`${paths.localGeneratorDirectory}/node_modules/stimpak-subgenerator`;

		paths.localSymlinkedSubgeneratorDirectory2 =
			`${paths.localSymlinkedSubgeneratorDirectory}/node_modules/stimpak-subgenerator-2`;

		paths.localSubgeneratorDirectory =
			`${paths.localDirectory}/stimpak-subgenerator`;

		paths.localSubgeneratorDirectory2 =
			`${paths.localDirectory}/stimpak-subgenerator-2`;

		paths.globalGeneratorDirectory =
			`${paths.globalNodeModulesDirectory}/stimpak-00000`;
	}

	setFilesToCopy() {
		const paths = this.paths();

		this
		.copy(
			paths.fixtures.developmentGenerator,
			paths.localGeneratorDirectory
		)
		.copy(
			paths.fixtures.developmentSubgenerator,
			paths.localSubgeneratorDirectory
		)
		.copy(
			paths.fixtures.developmentSubgenerator2,
			paths.localSubgeneratorDirectory2
		);
	}

	setFilesToSymlink() {
		const paths = this.paths();

		rimraf.sync(paths.globalGeneratorDirectory);

		this
		.symlink(
			paths.localSubgeneratorDirectory,
			paths.localSymlinkedSubgeneratorDirectory
		)
		.symlink(
			paths.localSubgeneratorDirectory2,
			paths.localSymlinkedSubgeneratorDirectory2
		)
		.symlink(
			paths.localGeneratorDirectory,
			paths.globalGeneratorDirectory
		);
	}

	setDirectoriesToMake() {
		const paths = this.paths();
		this.makeDirectory(paths.localDirectory);
	}
}
