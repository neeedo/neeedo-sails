/*
 * dependencies
 */
var MessageBodyValidator = require('../../../api/validators/MessageBody')
should = require('should');

var translatorMock = function (message) {
  return message;
};

describe('[UNIT TEST] MessageBody validator', function () {
  it("fails if max length is exceeded", function (done) {
    var validator = new MessageBodyValidator(translatorMock, 20);

    validator.isValid("This text here has more than 20 characters. I'm pretty sure because I counted each single character.").should.be.false;
    validator.getErrorMessages().should.equal("The message must not exceed %s characters");

    done();
  });

  it("validates if length is not exceeded", function (done) {
    var validator = new MessageBodyValidator(translatorMock, 20);

    validator.isValid("This text here has less than 20 characters.").should.be.false;

    done();
  });
});
