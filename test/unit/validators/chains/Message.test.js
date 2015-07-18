/*
 * dependencies
 */
var MessageValidator = require('../../../../api/validators/chains/Message'),
    ApiClientService = require('../../../../api/services/ApiClientService'),
    should = require('should');

var translatorMock = function (message) {
  return message;
};

var givenSomeMessageValidationOptions = function() {
  return {
    messageBody: {
      // max length in characters
      maxLength: 10
    }
  };
};

describe('[UNIT TEST] Message validator', function () {
  it("fails and lists all error messages for invalid fields", function (done) {
    var validator = new MessageValidator(translatorMock, givenSomeMessageValidationOptions());

    validator.isValid(
      "%%invalidRecipientId%%",
      "This message is far too long, it exceeds 10 chars."
    ).should.be.false;

    (ApiClientService.PARAM_RECIPIENT_ID_KEY in validator.getErrorMessages()).should.be.true;
    (ApiClientService.PARAM_MESSAGE_BODY_KEY in validator.getErrorMessages()).should.be.true;

    done();
  });

  it("validates correct if valid fields are given", function (done) {
    var validator = new MessageValidator(translatorMock, givenSomeMessageValidationOptions());

    validator.isValid(
      "abcd1234",
      "This ok."
    ).should.be.true;

    (ApiClientService.PARAM_RECIPIENT_ID_KEY in validator.getErrorMessages()).should.be.false;
    (ApiClientService.PARAM_MESSAGE_BODY_KEY in validator.getErrorMessages()).should.be.false;

    done();
  });
});
