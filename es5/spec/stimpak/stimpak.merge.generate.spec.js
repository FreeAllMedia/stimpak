"use strict";

var _stimpak = require("../../lib/stimpak/stimpak.js");

var _stimpak2 = _interopRequireDefault(_stimpak);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _vinyl = require("vinyl");

var _vinyl2 = _interopRequireDefault(_vinyl);

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _temp = require("temp");

var _temp2 = _interopRequireDefault(_temp);

var _lodash = require("lodash.template");

var _lodash2 = _interopRequireDefault(_lodash);

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("stimpak.merge() (on .generate)", function () {
	var stimpak = void 0,
	    mergeStrategy = void 0,
	    templateDirectoryPath = void 0,
	    temporaryDirectoryPath = void 0,
	    results = void 0,
	    existingProjectPath = void 0,
	    existingFileName = void 0,
	    existingFilePath = void 0,
	    existingFileContents = void 0,
	    mergedFileContents = void 0,
	    answers = void 0;

	beforeEach(function (done) {
		templateDirectoryPath = _path2.default.normalize(__dirname + "/fixtures/templates/");
		temporaryDirectoryPath = _temp2.default.mkdirSync("stimpak.merge");
		existingProjectPath = _path2.default.normalize(__dirname + "/fixtures/existingProject/");

		_fsExtra2.default.copySync(existingProjectPath, temporaryDirectoryPath);

		results = {};

		mergedFileContents = "merged!";

		mergeStrategy = _sinon2.default.spy(function (generator, newFile, oldFile, mergeCallback) {
			results.generator = generator;
			results.newFile = newFile;
			results.oldFile = oldFile;

			results.mergedFile = new _vinyl2.default({
				cwd: results.newFile.cwd,
				base: results.newFile.base,
				path: results.newFile.path,
				contents: new Buffer(mergedFileContents)
			});

			mergeCallback(null, results.mergedFile);
		});

		existingFileName = "package.json";
		existingFilePath = temporaryDirectoryPath + "/" + existingFileName;
		existingFileContents = _fsExtra2.default.readFileSync(existingFilePath);

		answers = {
			className: "Foo",
			primaryFunctionName: "bar",
			dynamicFileName: "someName"
		};

		stimpak = new _stimpak2.default();
		stimpak.answers(answers).source("**.*").directory(templateDirectoryPath).destination(temporaryDirectoryPath).merge(existingFileName, mergeStrategy).generate(done);
	});

	it("should call the mergeStrategy with the generator", function () {
		results.generator.should.eql(stimpak);
	});

	it("should call the mergeStrategy with the new file as a vinyl object", function () {
		_vinyl2.default.isVinyl(results.newFile).should.be.true;
	});

	it("should set the new file to the appropriate file path", function () {
		var filePath = results.newFile.path;
		filePath.should.be.eql(existingFilePath);
	});

	it("should set the new file to the appropriate base path", function () {
		var base = results.newFile.base;
		base.should.be.eql(temporaryDirectoryPath);
	});

	it("should set the new file to the appropriate file contents", function () {
		var templateContents = _fsExtra2.default.readFileSync(templateDirectoryPath + "/" + existingFileName, { encoding: "utf-8" });
		var template = (0, _lodash2.default)(templateContents);
		var expectedFileContents = template(stimpak.answers());

		var actualFileContents = results.newFile.contents.toString();
		actualFileContents.should.be.eql(expectedFileContents);
	});

	it("should call the mergeStrategy with the old file as a vinyl object", function () {
		_vinyl2.default.isVinyl(results.oldFile).should.be.true;
	});

	it("should set the old file to the appropriate file path", function () {
		var filePath = results.oldFile.path;
		filePath.should.be.eql(existingFilePath);
	});

	it("should set the old file to the appropriate base", function () {
		var base = results.oldFile.base;
		base.should.be.eql(temporaryDirectoryPath);
	});

	it("should set the old file to the appropriate file contents", function () {
		var expectedFileContents = existingFileContents.toString();
		var actualFileContents = results.oldFile.contents.toString();
		actualFileContents.should.be.eql(expectedFileContents);
	});

	it("should overwrite existing files that don't have a merge strategy", function () {
		var templateContents = _fsExtra2.default.readFileSync(templateDirectoryPath + "/colors.js", { encoding: "utf-8" });
		var template = (0, _lodash2.default)(templateContents);
		var expectedFileContents = template(stimpak.answers());

		var actualFileContents = _fsExtra2.default.readFileSync(temporaryDirectoryPath + "/colors.js", { encoding: "utf-8" });

		actualFileContents.should.eql(expectedFileContents);
	});

	it("should render existing files like normal if there are no merge strategies at all", function (done) {
		var templateContents = _fsExtra2.default.readFileSync(templateDirectoryPath + "/colors.js", { encoding: "utf-8" });
		var template = (0, _lodash2.default)(templateContents);
		var expectedFileContents = template(stimpak.answers());

		stimpak = new _stimpak2.default();

		stimpak.answers(answers).source("**.*").directory(templateDirectoryPath).destination(temporaryDirectoryPath).generate(function () {
			var actualFileContents = _fsExtra2.default.readFileSync(temporaryDirectoryPath + "/colors.js", { encoding: "utf-8" });
			actualFileContents.should.eql(expectedFileContents);
			done();
		});
	});

	it("should write the file returned by the merge function callback", function () {
		var expectedFileContents = mergedFileContents;

		stimpak = new _stimpak2.default();

		var actualFileContents = _fsExtra2.default.readFileSync(temporaryDirectoryPath + "/" + existingFileName, { encoding: "utf-8" });
		actualFileContents.should.eql(expectedFileContents);
	});

	it("should return an error if a merge function returns an error", function (done) {
		var expectedErrorMessage = "Something went wrong!";

		stimpak = new _stimpak2.default();

		stimpak.answers(answers).source("**.*").directory(templateDirectoryPath).destination(temporaryDirectoryPath).merge(existingFilePath, function (generator, newFile, oldFile, mergeCallback) {
			mergeCallback(new Error(expectedErrorMessage));
		}).generate(function (error) {
			error.message.should.eql(expectedErrorMessage);
			done();
		});
	});
});