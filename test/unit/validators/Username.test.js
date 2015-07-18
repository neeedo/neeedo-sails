/*
 * dependencies
 */
var UsernameValidator = require('../../../api/validators/Username')
should = require('should');

var translatorMock = function (message) {
  return message;
};

describe('[UNIT TEST] Username validator', function () {
  it("fails if min distance is undershot", function (done) {
    var validator = new UsernameValidator(translatorMock, 5, 20);

    validator.isValid("abc5").should.be.false;
    validator.getErrorMessages().should.equal("The username must have at least %s characters");

    done();
  });

  it("fails if max distance is exceeded", function (done) {
    var validator = new UsernameValidator(translatorMock, 5, 20);

    validator.isValid("abddsadasfasfasfasfasf12412412asfasfas5fasf").should.be.false;
    validator.getErrorMessages().should.equal("The username must not have more than %s characters");

    done();
  });

  it("fails if username does contain forbidden characters", function (done) {
    var validator = new UsernameValidator(translatorMock, 5, 20);

    validator.isValid("abc@ddasd").should.be.false;
    validator.isValid("eval()").should.be.false;
    validator.isValid("***").should.be.false;
    validator.getErrorMessages().indexOf("Only alphanumerical characters and '_', '-' are allowed.").should.not.be.equal(-1);

    done();
  });

  it("validates correct", function (done) {
    var validator = new UsernameValidator(translatorMock, 5, 20);

    validator.isValid("newuser1").should.be.true;
    validator.isValid("maxmuster").should.be.true;
    validator.isValid("MaxMuster").should.be.true;
    validator.isValid("1user").should.be.true;

    done();
  });
});
