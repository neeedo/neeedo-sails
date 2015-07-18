/*
 * dependencies
 */
var LoginValidator = require('../../../../api/validators/chains/Login'),
    ApiClientService = require('../../../../api/services/ApiClientService'),
    should = require('should');

var translatorMock = function (message) {
  return message;
};

var givenSomeUserValidationOptions = function() {
  return {
    username: {
      minCount: 5,
      maxCount: 50
    },
    password: {
      minCount: 5,
      maxCount: 50
    }
  };
};

describe('[UNIT TEST] Login validator', function () {
  it("fails and lists all error messages for invalid fields", function (done) {
    var validator = new LoginValidator(translatorMock, givenSomeUserValidationOptions());

    validator.isValid(
      "invalidMail%",
      "12" // password
    ).should.be.false;

    (ApiClientService.PARAM_EMAIL_KEY in validator.getErrorMessages()).should.be.true;

    done();
  });

  it("validates correct if valid fields are given", function (done) {
    var validator = new LoginValidator(translatorMock, givenSomeUserValidationOptions());

    validator.isValid(
      "max@muster.de",
      "12" // password
    ).should.be.true;

    (ApiClientService.PARAM_EMAIL_KEY in validator.getErrorMessages()).should.be.false;

    done();
  });
});
