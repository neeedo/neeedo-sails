/*
 * dependencies
 */
var TagsValidator = require('../../../api/validators/Tags')
should = require('should');

var translatorMock = function (message) {
  return message;
};

describe('[UNIT TEST] Tags validator', function () {
  it("fails if min count is undershot", function (done) {
    var validator = new TagsValidator(translatorMock, 2, 10);

    validator.isValid("onlyonetag").should.be.false;
    validator.getErrorMessages().should.equal("You need to provide a minimum of %s tags");

    done();
  });

  it("fails if max price is exceeded", function (done) {
    var validator = new TagsValidator(translatorMock, 2, 3);

    validator.isValid("tag1,tag2,tag3,tag4").should.be.false;
    validator.getErrorMessages().should.equal("You need to provide a maximum of %s tags");

    done();
  });

  it("fails if a tag contains forbidden characters", function (done) {
    var validator = new TagsValidator(translatorMock, 2, 5);

    validator.isValid("tag1,tag2,tag3,%%forbidden%%").should.be.false;
    validator.getErrorMessages().should.equal("Invalid tag %s");

    done();
  });

  it("validates if correct tags are given", function (done) {
    var validator = new TagsValidator(translatorMock, 2, 10);

    validator.isValid("tag1,tag2,tag3,tag4,tag5,tag6").should.be.true;
    done();
  });
});
