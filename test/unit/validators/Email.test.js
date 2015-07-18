/*
 * dependencies
 */
var EmailValidator = require('../../../api/validators/Email')
should = require('should');

var translatorMock = function (message) {
  return message;
};

describe('[UNIT TEST] Email validator', function () {
  it("fails if no valid eMail is given", function (done) {
    var validator = new EmailValidator(translatorMock);

    validator.isValid("test@test").should.be.false;
    validator.isValid("test").should.be.false;
    validator.isValid("test@invaliddomain_de").should.be.false;
    validator.getErrorMessages().indexOf("You entered an invalid eMail address.").should.not.be.equal(-1);
    done();
  });

  it("validates if valid eMail is given", function (done) {
    var validator = new EmailValidator(translatorMock);

    validator.isValid("test@test.de").should.be.true;
    validator.isValid("max-muster@test.de").should.be.true;
    validator.isValid("max_muster@test.de").should.be.true;
    validator.isValid("max_muster@mail.test.de").should.be.true;
    done();
  });
});
