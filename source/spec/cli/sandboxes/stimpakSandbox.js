import fileSystem from "fs-extra";
import temp from "temp";
import path from "path";
import rimraf from "rimraf";
import ChainLink from "mrt";
import glob from "glob";

import {
		execSync as runCommandSync
} from "child_process";

const setProperties = Symbol(),
			setDefaultPaths = Symbol();

export default class StimpakSandbox extends ChainLink {
	initialize() {
		// TODO: Turn temporary file tracking in stimpak sandbox back on
		//temp.track();

		this[setProperties]();
		this[setDefaultPaths]();

		this.configure();

		this.showDebug = false;

		this.debug("StimpakSandbox DEBUG:");
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
		this.debug("makeDirectories");
		this.makeDirectory().forEach(directoryPath => {
			this.debug(`\t${directoryPath}`);
			fileSystem.mkdirsSync(directoryPath);
		});
		this.debug(glob.sync("**/*", { cwd: this.paths().root, follow: true }));
	}

	copyFiles() {
		this.debug("copyFiles");
		this.copy().forEach(copyPath => {
			const copyFromPath = copyPath[0];
			const copyToPath = copyPath[1];
			this.debug(`\tFrom: ${copyFromPath}`);
			this.debug(`\tTo: ${copyToPath}`);
			this.debug("");
			fileSystem.copySync(copyFromPath, copyToPath);
		});
		this.debug(glob.sync("**/*", { cwd: this.paths().root, follow: true }));
	}

	symlinkFiles() {
		this.debug("symlinkFiles");
		this.symlink().forEach(symlinkPath => {
			const symlinkFromPath = symlinkPath[0];
			const symlinkToPath = symlinkPath[1];
			this.debug(`\tFrom: ${symlinkFromPath}`);
			this.debug(`\tTo: ${symlinkToPath}`);
			this.debug("");
			fileSystem.symlinkSync(symlinkFromPath, symlinkToPath);
		});
		this.debug(glob.sync("**/*", { cwd: this.paths().root, follow: true }));
	}

	unSymlinkFiles() {
		this.symlink().forEach(symlinkPath => {
			const symlinkToPath = symlinkPath[1];

			rimraf.sync(symlinkToPath);
		});
	}

	[setProperties]() {
		this.properties("paths").merge;
		this.properties(
			"copy",
			"symlink"
		).multi.aggregate;

		this.properties(
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

	debug(message) {
		if (this.showDebug) {
			console.log(`\t${message}`);
		}
	}
}
