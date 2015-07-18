/*
 * dependencies
 */
var DemandValidator = require('../../../../api/validators/chains/Demand'),
    ApiClientService = require('../../../../api/services/ApiClientService'),
    should = require('should');

var translatorMock = function (message) {
  return message;
};

var givenSomeDemandValidationOptions = function() {
  return {
    mustTags: {
      minCount: 1,
      maxCount: 20
    },
    shouldTags: {
      minCount: 1,
      maxCount: 20
    },
    // prices in €
    price: {
      // mininum and maximum price for minimum demand price
      min: {
        minimum: 0,
        maximum: 500
      },
      // minimum and maximum price for maximum demand price
      max: {
        minimum: 0,
        maximum: 500
      }
    },
    distance: {
      // maximum distance in KM
      maximum: 50000
    }
  };
};

describe('[UNIT TEST] Demand validator', function () {
  it("fails and lists all error messages for invalid fields", function (done) {
    var validator = new DemandValidator(translatorMock, givenSomeDemandValidationOptions());

    validator.isValid(
      "%%forbiddenMustTag%%",
      "%%forbiddenShouldTag%%",
      1000, // min price
      10000, // max price
      "%%invalidLocation",
      "%%invalidLocation",
      -1
    ).should.be.false;

    (ApiClientService.PARAM_SHOULD_TAGS_KEY in validator.getErrorMessages()).should.be.true;
    (ApiClientService.PARAM_MUST_TAGS_KEY in validator.getErrorMessages()).should.be.true;
    (ApiClientService.PARAM_MIN_PRICE_KEY in validator.getErrorMessages()).should.be.true;
    (ApiClientService.PARAM_MAX_PRICE_KEY in validator.getErrorMessages()).should.be.true;
    (ApiClientService.PARAM_LATITUDE_KEY in validator.getErrorMessages()).should.be.true;
    (ApiClientService.PARAM_LONGITUDE_KEY in validator.getErrorMessages()).should.be.true;
    (ApiClientService.PARAM_DISTANCE_KEY in validator.getErrorMessages()).should.be.true;

    done();
  });

  it("validates correct if valid fields are given", function (done) {
    var validator = new DemandValidator(translatorMock, givenSomeDemandValidationOptions());

    validator.isValid(
      "IPhone",
      "new",
      10, // min price
      100, // max price
      55.531,
      48.412,
      50 // distance
    ).should.be.true;

    (ApiClientService.PARAM_SHOULD_TAGS_KEY in validator.getErrorMessages()).should.be.false;
    (ApiClientService.PARAM_MUST_TAGS_KEY in validator.getErrorMessages()).should.be.false;
    (ApiClientService.PARAM_MIN_PRICE_KEY in validator.getErrorMessages()).should.be.false;
    (ApiClientService.PARAM_MAX_PRICE_KEY in validator.getErrorMessages()).should.be.false;
    (ApiClientService.PARAM_LATITUDE_KEY in validator.getErrorMessages()).should.be.false;
    (ApiClientService.PARAM_LONGITUDE_KEY in validator.getErrorMessages()).should.be.false;
    (ApiClientService.PARAM_DISTANCE_KEY in validator.getErrorMessages()).should.be.false;

    done();
  });
});
