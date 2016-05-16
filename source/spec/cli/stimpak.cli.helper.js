import fileSystem from "fs-extra";
import path from "path";
import temp from "temp";

export function setupCliEnvironment() {
  const temporaryDirectoryPath = temp.mkdirSync("stimpakgenerators");

  const projectRootPath = path.normalize(
    `${__dirname}/../../../`
  );

  const es5DirectoryPath =
    `${projectRootPath}/es5`;
  const nodeModulesFixtureDirectoryPath =
    `${es5DirectoryPath}/spec/cli/fixtures/project/node_modules`;

  const generatorOneDirectoryPath =
    `${nodeModulesFixtureDirectoryPath}/stimpak-test-1`;
  const generatorTwoDirectoryPath =
    `${nodeModulesFixtureDirectoryPath}/stimpak-test-2`;
  const generatorThreeDirectoryPath =
    `${nodeModulesFixtureDirectoryPath}/stimpak-test-3`;
  const generatorFourDirectoryPath =
    `${nodeModulesFixtureDirectoryPath}/stimpak-test-4`;

  const pseudoGlobalNodeModulesDirectoryPath =
    `${temporaryDirectoryPath}/node_modules`;
  const userProjectDirectoryPath =
    `${temporaryDirectoryPath}/user_project`;
  const pseudoLocalNodeModulesDirectoryPath =
    `${userProjectDirectoryPath}/node_modules`;

  const stimpakCliPath =
    `${pseudoGlobalNodeModulesDirectoryPath}/stimpak/es5/lib/cli/stimpak.cli.js`;

  fileSystem.mkdirSync(pseudoGlobalNodeModulesDirectoryPath);
  fileSystem.mkdirSync(userProjectDirectoryPath);
  fileSystem.mkdirSync(pseudoLocalNodeModulesDirectoryPath);

  const pseudoNpmInstall = (srcDirectoryPath, dstDirectoryPath) => {
    try {
      fileSystem.unlinkSync(dstDirectoryPath);
    } catch (ex) {
      // nop
    }
    fileSystem.symlinkSync(srcDirectoryPath, dstDirectoryPath);
  };

  const pseudoNpmInstallGlobally = (srcDirectoryPath, moduleName) => {
    pseudoNpmInstall(srcDirectoryPath, `${pseudoGlobalNodeModulesDirectoryPath}/${moduleName}`);
  };

  const pseudoNpmInstallLocally = (srcDirectoryPath, moduleName) => {
    pseudoNpmInstall(srcDirectoryPath, `${pseudoLocalNodeModulesDirectoryPath}/${moduleName}`);
  };

  // simulate "npm install ..."
  pseudoNpmInstallGlobally(projectRootPath, 'stimpak');
  pseudoNpmInstallGlobally(generatorOneDirectoryPath, 'stimpak-test-1');
  pseudoNpmInstallLocally(generatorTwoDirectoryPath, 'stimpak-test-2');
  pseudoNpmInstallGlobally(generatorThreeDirectoryPath, 'stimpak-test-3');
  pseudoNpmInstallGlobally(generatorFourDirectoryPath, 'stimpak-test-4');

  const command = `node ${stimpakCliPath}`;

  return {
    temporaryDirectoryPath,
    userProjectDirectoryPath,
    pseudoNpmInstallGlobally,
    pseudoNpmInstallLocally,
    command,
  };
}
