/*
 * dependencies
 */
var LocationValidator = require('../../../api/validators/Location')
should = require('should');

var translatorMock = function (message) {
  return message;
};

describe('[UNIT TEST] Location validator', function () {
  it("fails if no valid location is given", function (done) {
    var validator = new LocationValidator(translatorMock);

    validator.isValid("noCoordinate@").should.be.false;

    validator.getErrorMessages().indexOf("Invalid value for coordinate.").should.not.be.equal(-1);
    done();
  });

  it("validates if valid location is given", function (done) {
    var validator = new LocationValidator(translatorMock);

    validator.isValid(55.5553).should.be.true;
    done();
  });
});
