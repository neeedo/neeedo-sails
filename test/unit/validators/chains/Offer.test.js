/*
 * dependencies
 */
var OfferValidator = require('../../../../api/validators/chains/Offer'),
    ApiClientService = require('../../../../api/services/ApiClientService'),
    should = require('should');

var translatorMock = function (message) {
  return message;
};

var givenSomeOfferValidationOptions = function() {
  return {
    tags: {
      minCount: 1,
      maxCount: 20
    },
    // prices in €
    price: {
      minimum: 0,
      maximum: 500
    },
    images: {
      minCount: 1,
      maxCount: 5
    }
  };
};

describe('[UNIT TEST] Offer validator', function () {
  it("fails and lists all error messages for invalid fields", function (done) {
    var validator = new OfferValidator(translatorMock, givenSomeOfferValidationOptions());

    validator.isValid(
      "%%forbiddenMustTag%%",
      1000, // simple price
      "%%invalidLocation",
      "%%invalidLocation",
      [] // no image
    ).should.be.false;

    (ApiClientService.PARAM_TAGS_KEY in validator.getErrorMessages()).should.be.true;
    (ApiClientService.PARAM_SIMPLE_PRICE_KEY in validator.getErrorMessages()).should.be.true;
    (ApiClientService.PARAM_LATITUDE_KEY in validator.getErrorMessages()).should.be.true;
    (ApiClientService.PARAM_LONGITUDE_KEY in validator.getErrorMessages()).should.be.true;
    (ApiClientService.PARAM_LATITUDE_KEY in validator.getErrorMessages()).should.be.true;
    (ApiClientService.PARAM_IMAGES_KEY in validator.getErrorMessages()).should.be.true;

    done();
  });

  it("validates correct if valid fields are given", function (done) {
    var validator = new OfferValidator(translatorMock, givenSomeOfferValidationOptions());

    validator.isValid(
      "IPhone",
      300, // simple price
      55.2123,
      43.123,
      ['someImage']
    ).should.be.true;

    (ApiClientService.PARAM_TAGS_KEY in validator.getErrorMessages()).should.be.false;
    (ApiClientService.PARAM_SIMPLE_PRICE_KEY in validator.getErrorMessages()).should.be.false;
    (ApiClientService.PARAM_LATITUDE_KEY in validator.getErrorMessages()).should.be.false;
    (ApiClientService.PARAM_LONGITUDE_KEY in validator.getErrorMessages()).should.be.false;
    (ApiClientService.PARAM_LATITUDE_KEY in validator.getErrorMessages()).should.be.false;
    (ApiClientService.PARAM_IMAGES_KEY in validator.getErrorMessages()).should.be.false;

    done();
  });
});
