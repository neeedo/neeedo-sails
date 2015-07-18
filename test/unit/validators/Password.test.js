/*
 * dependencies
 */
var PasswordValidator = require('../../../api/validators/Password')
should = require('should');

var translatorMock = function (message) {
  return message;
};

describe('[UNIT TEST] Password validator', function () {
  it("fails if min distance is undershot", function (done) {
    var validator = new PasswordValidator(translatorMock, 5, 20);

    validator.isValid("abc5").should.be.false;
    validator.getErrorMessages().should.equal("The password must have at least %s characters");

    done();
  });

  it("fails if max distance is exceeded", function (done) {
    var validator = new PasswordValidator(translatorMock, 5, 20);

    validator.isValid("abddsadasfasfasfasfasf12412412asfasfas5fasf").should.be.false;
    validator.getErrorMessages().should.equal("The password must not have more than %s characters");

    done();
  });

  it("fails if password does contain forbidden characters", function (done) {
    var validator = new PasswordValidator(translatorMock, 5, 20);

    validator.isValid("abc@ddasd").should.be.false;
    validator.isValid("eval()").should.be.false;
    validator.isValid("***").should.be.false;
    validator.getErrorMessages().indexOf("The password must consist of at least one number. Only alphanumerical characters and '_', '-', '$', '*', ''', ';', '.' are allowed.").should.not.be.equal(-1);

    done();
  });

  it("validates correct", function (done) {
    var validator = new PasswordValidator(translatorMock, 5, 20);

    validator.isValid("secretpw1245").should.be.true;

    done();
  });
});
