/*
 * dependencies
 */
var DistanceValidator = require('../../../api/validators/Distance')
should = require('should');

var translatorMock = function (message) {
  return message;
};

describe('[UNIT TEST] Distance validator', function () {
  it("fails if max distance is exceeded", function (done) {
    var validator = new DistanceValidator(translatorMock, 20);

    validator.isValid(30).should.be.false;
    validator.getErrorMessages().should.equal("The maximum allowed distance is %s");

    done();
  });

  it("fails if min distance is undershot", function (done) {
    var validator = new DistanceValidator(translatorMock, 20);

    validator.isValid(-1).should.be.false;
    validator.getErrorMessages().should.equal("The minimum distance must be %s");

    done();
  });

  it("validates if max distance is not exceeded", function (done) {
    var validator = new DistanceValidator(translatorMock, 20);

    validator.isValid(10).should.be.true;
    done();
  });
});
