import fileSystem from "fs-extra";
import temp from "temp";
import path from "path";
import rimraf from "rimraf";

import ChainLink from "mrt";
import {
		execSync as runCommandSync
} from "child_process";

const setParameters = Symbol(),
			setDefaultPaths = Symbol();

export default class StimpakSandbox extends ChainLink {
	initialize() {
		//temp.track();

		this[setParameters]();
		this[setDefaultPaths]();

		this.configure();
	}

	configure() { /* STUB */ }

	setup() {
		this.makeDirectories();
		this.copyFiles();
		this.symlinkFiles();
	}

	cleanup() {
		this.unSymlinkFiles();
		temp.cleanupSync();
	}

	runWithArguments(argumentString) {
		const paths = this.paths();
		const stdout = runCommandSync(`node ${paths.bin} ${argumentString}`, { cwd: paths.root });
		return stdout.toString();
	}

	makeDirectories() {
		this.makeDirectory().forEach(directoryPath => {
			fileSystem.mkdirsSync(directoryPath);
		});
	}

	copyFiles() {
		this.copy().forEach(copyPath => {
			const copyFromPath = copyPath[0];
			const copyToPath = copyPath[1];
			fileSystem.copySync(copyFromPath, copyToPath);
		});
	}

	symlinkFiles() {
		this.symlink().forEach(symlinkPath => {
			const symlinkFromPath = symlinkPath[0];
			const symlinkToPath = symlinkPath[1];
			fileSystem.symlinkSync(symlinkFromPath, symlinkToPath);
		});
	}

	unSymlinkFiles() {
		this.symlink().forEach(symlinkPath => {
			const symlinkToPath = symlinkPath[1];

			rimraf.sync(symlinkToPath);
		});
	}

	[setParameters]() {
		this.parameters("paths").mergeKeyValues;
		this.parameters(
			"copy",
			"symlink"
		).aggregate.multiValue;

		this.parameters(
			"makeDirectory"
		).aggregate;
	}

	[setDefaultPaths]() {
		const defaultPaths = {};

		defaultPaths.root = temp.mkdirSync();

		defaultPaths.projectDirectory =
			path.normalize(`${__dirname}/../../../..`);

		defaultPaths.bin =
			`${defaultPaths.projectDirectory}/es5/lib/cli/stimpak.cli.js`;

		defaultPaths.sourceDirectory =
			`${defaultPaths.projectDirectory}/source`;

		defaultPaths.fixtureDirectory =
			`${defaultPaths.sourceDirectory}/spec/cli/fixtures`;

		defaultPaths.fixtures = {
			error:
				`${defaultPaths.fixtureDirectory}/stimpak-generator-error`,
			generator:
				`${defaultPaths.fixtureDirectory}/stimpak-generator`
		};

		defaultPaths.globalNodeModulesDirectory =
			runCommandSync(
				"npm config get prefix",
				{ cwd: defaultPaths.root }
			).toString().replace(/[\n\r]/, "/lib/node_modules");

		this.paths(defaultPaths);
	}
}
