"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupCliEnvironment = setupCliEnvironment;

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _temp = require("temp");

var _temp2 = _interopRequireDefault(_temp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setupCliEnvironment() {
  var temporaryDirectoryPath = _temp2.default.mkdirSync("stimpakgenerators");

  var projectRootPath = _path2.default.normalize(__dirname + "/../../../");

  var es5DirectoryPath = projectRootPath + "/es5";
  var nodeModulesFixtureDirectoryPath = es5DirectoryPath + "/spec/cli/fixtures/project/node_modules";

  var generatorOneDirectoryPath = nodeModulesFixtureDirectoryPath + "/stimpak-test-1";
  var generatorTwoDirectoryPath = nodeModulesFixtureDirectoryPath + "/stimpak-test-2";
  var generatorThreeDirectoryPath = nodeModulesFixtureDirectoryPath + "/stimpak-test-3";
  var generatorFourDirectoryPath = nodeModulesFixtureDirectoryPath + "/stimpak-test-4";

  var pseudoGlobalNodeModulesDirectoryPath = temporaryDirectoryPath + "/node_modules";
  var userProjectDirectoryPath = temporaryDirectoryPath + "/user_project";
  var pseudoLocalNodeModulesDirectoryPath = userProjectDirectoryPath + "/node_modules";

  var stimpakCliPath = pseudoGlobalNodeModulesDirectoryPath + "/stimpak/es5/lib/cli/stimpak.cli.js";

  _fsExtra2.default.mkdirSync(pseudoGlobalNodeModulesDirectoryPath);
  _fsExtra2.default.mkdirSync(userProjectDirectoryPath);
  _fsExtra2.default.mkdirSync(pseudoLocalNodeModulesDirectoryPath);

  var pseudoNpmInstall = function pseudoNpmInstall(srcDirectoryPath, dstDirectoryPath) {
    try {
      _fsExtra2.default.unlinkSync(dstDirectoryPath);
    } catch (ex) {
      // nop
    }
    _fsExtra2.default.symlinkSync(srcDirectoryPath, dstDirectoryPath);
  };

  var pseudoNpmInstallGlobally = function pseudoNpmInstallGlobally(srcDirectoryPath, moduleName) {
    pseudoNpmInstall(srcDirectoryPath, pseudoGlobalNodeModulesDirectoryPath + "/" + moduleName);
  };

  var pseudoNpmInstallLocally = function pseudoNpmInstallLocally(srcDirectoryPath, moduleName) {
    pseudoNpmInstall(srcDirectoryPath, pseudoLocalNodeModulesDirectoryPath + "/" + moduleName);
  };

  // simulate "npm install ..."
  pseudoNpmInstallGlobally(projectRootPath, 'stimpak');
  pseudoNpmInstallGlobally(generatorOneDirectoryPath, 'stimpak-test-1');
  pseudoNpmInstallLocally(generatorTwoDirectoryPath, 'stimpak-test-2');
  pseudoNpmInstallGlobally(generatorThreeDirectoryPath, 'stimpak-test-3');
  pseudoNpmInstallGlobally(generatorFourDirectoryPath, 'stimpak-test-4');

  var command = "node " + stimpakCliPath;

  return {
    temporaryDirectoryPath: temporaryDirectoryPath,
    userProjectDirectoryPath: userProjectDirectoryPath,
    pseudoNpmInstallGlobally: pseudoNpmInstallGlobally,
    pseudoNpmInstallLocally: pseudoNpmInstallLocally,
    command: command
  };
}