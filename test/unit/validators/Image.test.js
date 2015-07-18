/*
 * dependencies
 */
var ImageValidator = require('../../../api/validators/Image')
should = require('should');

var translatorMock = function (message) {
  return message;
};

var newImageValidator = function() {
  return new ImageValidator(
    ["png", "jpg"],
    1000000, // bytes
    5, // count per object
    "png, jpg",
    translatorMock);
};

describe('[UNIT TEST] Image validator', function () {
  it("fails if count is exceeded", function (done) {
    var validator = newImageValidator();
    validator.maxCount = -1;

    var image = {};

    validator.isValid(image).should.be.false;
    validator.getErrorMessages().should.equal("You uploaded too many images. maximum number of images: -1");

    done();
  });

  it("fails if wrong file type is given", function (done) {
    var validator = newImageValidator();

    var image = {type: "bmp"};

    validator.isValid(image).should.be.false;
    validator.getErrorMessages().should.equal("You uploaded an invalid file type (file %s). Allowed file types: png, jpg");

    done();
  });

  it("fails if file is too large", function (done) {
    var validator = newImageValidator();

    var image = {type: "png", size: 9999999};

    validator.isValid(image).should.be.false;
    validator.getErrorMessages().should.equal("The file %s is too big. maximal size: 1000000");

    done();
  });

  it("validates correct", function (done) {
    var validator = newImageValidator();

    var image = {type: "png", size: 10000};

    validator.isValid(image).should.be.true;

    done();
  });

});
