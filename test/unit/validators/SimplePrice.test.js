/*
 * dependencies
 */
var SimplePriceValidator = require('../../../api/validators/SimplePrice')
should = require('should');

var translatorMock = function (message) {
  return message;
};

describe('[UNIT TEST] Simple Price validator', function () {
  it("fails if min price is undershot", function (done) {
    var validator = new SimplePriceValidator(translatorMock, 5, 20);

    validator.isValid(4).should.be.false;
    validator.getErrorMessages().should.equal("The minimum allowed price is %s");

    done();
  });

  it("fails if max price is exceeded", function (done) {
    var validator = new SimplePriceValidator(translatorMock, 5, 20);

    validator.isValid(25).should.be.false;
    validator.getErrorMessages().should.equal("The maximum allowed price is %s");

    done();
  });

  it("validates if price is within range", function (done) {
    var validator = new SimplePriceValidator(translatorMock, 5, 20);

    validator.isValid(15).should.be.true;
    done();
  });
});
