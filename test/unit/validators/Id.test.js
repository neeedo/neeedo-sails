/*
 * dependencies
 */
var IdValidator = require('../../../api/validators/Id')
should = require('should');

var translatorMock = function (message) {
  return message;
};

describe('[UNIT TEST] ID validator', function () {
  it("fails if no valid ID is given", function (done) {
    var validator = new IdValidator(translatorMock);

    validator.isValid("ID12345@").should.be.false;
    validator.isValid("ID12345^").should.be.false;
    validator.isValid("%%%&ID12345^").should.be.false;
    validator.isValid("$_GET['eval']").should.be.false;
    validator.isValid("eval()").should.be.false;

    validator.getErrorMessages().indexOf("Invalid ID given.").should.not.be.equal(-1);
    done();
  });

  it("validates if valid ID is given", function (done) {
    var validator = new IdValidator(translatorMock);

    validator.isValid("13b29381-3ef3-4446-8089-f263988fe129").should.be.true;
    done();
  });
});
