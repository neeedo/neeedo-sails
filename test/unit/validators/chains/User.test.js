/*
 * dependencies
 */
var UserValidator = require('../../../../api/validators/chains/User'),
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

describe('[UNIT TEST] User validator', function () {
  it("fails and lists all error messages for invalid fields", function (done) {
    var validator = new UserValidator(translatorMock, givenSomeUserValidationOptions());

    validator.isValid(
      "123", // username
      "max@muster", // email
      "12" // password
    ).should.be.false;

    (ApiClientService.PARAM_USERNAME_KEY in validator.getErrorMessages()).should.be.true;
    (ApiClientService.PARAM_EMAIL_KEY in validator.getErrorMessages()).should.be.true;
    (ApiClientService.PARAM_PASSWORD_KEY in validator.getErrorMessages()).should.be.true;

    done();
  });

  it("validates correct if valid fields are given", function (done) {
    var validator = new UserValidator(translatorMock, givenSomeUserValidationOptions());

    validator.isValid(
      "maxmuster", // username
      "max@muster.de", // email
      "test1234" // password
    ).should.be.true;

    (ApiClientService.PARAM_USERNAME_KEY in validator.getErrorMessages()).should.be.false;
    (ApiClientService.PARAM_EMAIL_KEY in validator.getErrorMessages()).should.be.false;
    (ApiClientService.PARAM_PASSWORD_KEY in validator.getErrorMessages()).should.be.false;

    done();
  });
});
