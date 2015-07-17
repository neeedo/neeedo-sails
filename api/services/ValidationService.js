var util = require('util'),
  IdValidator = require('../validators/Id'),
  TagsValidator = require('../validators/Tags'),
  SimplePriceValidator = require('../validators/SimplePrice'),
  DemandPriceValidator = require('../validators/DemandPrice'),
  LocationValidator = require('../validators/Location'),
  DistanceValidator = require('../validators/Distance'),
  ImageValidator = require('../validators/Image'),
  OfferValidator = require('../validators/chains/Offer'),
  DemandValidator = require('../validators/chains/Demand'),
  _ = require('underscore')
;

module.exports = {
  newIdValidator: function (translator) {
    return new IdValidator(translator);
  },

  newTagsValidator: function (translator, minTagCount, maxTagCount) {
    return new TagsValidator(translator, minTagCount, maxTagCount);
  },

  newDemandPriceValidator: function (translator, minAllowedPrice, maxAllowedPrice) {
    return new DemandPriceValidator(translator, minAllowedPrice, maxAllowedPrice);
  },

  newSimplePriceValidator: function (translator, minAllowedPrice, maxAllowedPrice) {
    return new SimplePriceValidator(translator, minAllowedPrice, maxAllowedPrice);
  },

  newLocationValidator: function (translator) {
    return new LocationValidator(translator);
  },

  newDistanceValidator: function (translator, maxDistance) {
    return new DistanceValidator(translator, maxDistance);
  },

  newOfferValidator: function (translator) {
    return new OfferValidator(translator, sails.config.webapp.validations.offer);
  },

  newDemandValidator: function (translator) {
    return new DemandValidator(translator, sails.config.webapp.validations.demand);
  }
};
