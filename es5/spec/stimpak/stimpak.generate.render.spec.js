"use strict";

var _stimpak = require("../../lib/stimpak/stimpak.js");

var _stimpak2 = _interopRequireDefault(_stimpak);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _temp = require("temp");

var _temp2 = _interopRequireDefault(_temp);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

var _lodash = require("lodash.template");

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("stimpak.generate() (template rendering)", function () {
	var stimpak = void 0,
	    temporaryDirectoryPath = void 0,
	    templateDirectoryPath = void 0,
	    sourceGlob = void 0,
	    templateFilePaths = void 0,
	    renderedFilePaths = void 0,
	    generatedFilePaths = void 0;

	beforeEach(function (done) {
		stimpak = new _stimpak2.default();

		temporaryDirectoryPath = _temp2.default.mkdirSync("stimpak.generate");
		templateDirectoryPath = _path2.default.normalize(__dirname + "/fixtures/templates");

		templateFilePaths = _glob2.default.sync("**/*", { cwd: templateDirectoryPath });
		renderedFilePaths = templateFilePaths.map(function (templateFilePath) {
			return templateFilePath.replace("##dynamicFileName##", "shapes");
		});

		stimpak.answers({
			dynamicFileName: "shapes",
			className: "Foo",
			primaryFunctionName: "index"
		}).source(sourceGlob).directory(templateDirectoryPath).destination(temporaryDirectoryPath).generate(function () {
			generatedFilePaths = _glob2.default.sync("**/*", { cwd: temporaryDirectoryPath });
			done();
		});
	});

	it("should render templates to a destination directory", function () {
		generatedFilePaths.should.have.members(renderedFilePaths);
	});

	it("should render templates with .answers as template values", function () {
		var templateFileContents = _fs2.default.readFileSync(templateDirectoryPath + "/colors.js", { encoding: "utf-8" });
		var template = (0, _lodash2.default)(templateFileContents);
		var expectedRenderedTemplate = template(stimpak.answers());

		var actualRenderedTemplate = _fs2.default.readFileSync(temporaryDirectoryPath + "/colors.js", { encoding: "utf-8" });

		actualRenderedTemplate.should.eql(expectedRenderedTemplate);
	});

	it("should return an error if destination is not set", function (done) {
		stimpak = new _stimpak2.default();
		stimpak.generate(function (error) {
			error.message.should.eql("You must set .destination() before you can .generate()");
			done();
		});
	});
});