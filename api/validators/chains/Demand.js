var _ = require('underscore')
  ;

function Demand(translator, demandValidationOptions) {
  this.errorMessages = [];
  this.translator = translator;
  this.mustTagsValidator = undefined;
  this.shouldTagsValidator = undefined;
  this.minPriceValidator = undefined;
  this.maxPriceValidator = undefined;
  this.locationValidator = undefined;
  this.distanceValidator = undefined;

  this.initializeValidationChain = function() {
    // new mustTagsValidator
    this.mustTagsValidator = ValidationService.newTagsValidator(
      translator,
      demandValidationOptions.mustTags.minCount,
      demandValidationOptions.mustTags.maxCount
    );

    // new mustTagsValidator
    this.shouldTagsValidator = ValidationService.newTagsValidator(
      translator,
      demandValidationOptions.shouldTags.minCount,
      demandValidationOptions.shouldTags.maxCount
    );

    // new min price validator
    this.minPriceValidator = ValidationService.newSimplePriceValidator(
      translator,
      demandValidationOptions.price.min.minimum,
      demandValidationOptions.price.min.maximum
    );

    // new min price validator
    this.maxPriceValidator = ValidationService.newSimplePriceValidator(
      translator,
      demandValidationOptions.price.max.minimum,
      demandValidationOptions.price.max.maximum
    );

    // new distance validator
    this.distanceValidator = ValidationService.newDistanceValidator(
      translator,
      demandValidationOptions.distance.maximum
    );

    // new location validator
    this.locationValidator = ValidationService.newLocationValidator(translator);
  };

  this.initializeValidationChain();
};

Demand.prototype.isValid = function(mustTags, shouldTags, minPrice, maxPrice, latitude, longitude, distance)
{
  var validationResult = true;

  if (!this.shouldTagsValidator.isValid(shouldTags)) {
    this.errorMessages[ApiClientService.PARAM_SHOULD_TAGS_KEY] = this.shouldTagsValidator.getErrorMessages();
    validationResult = false;
  }

  if (!this.mustTagsValidator.isValid(mustTags)) {
    this.errorMessages[ApiClientService.PARAM_MUST_TAGS_KEY] = this.mustTagsValidator.getErrorMessages();
    validationResult = false;
  }

  if (!this.minPriceValidator.isValid(minPrice)) {
    this.errorMessages[ApiClientService.PARAM_MIN_PRICE_KEY] = this.minPriceValidator.getErrorMessages();
    validationResult = false;
  }

  if (!this.maxPriceValidator.isValid(maxPrice)) {
    this.errorMessages[ApiClientService.PARAM_MAX_PRICE_KEY] = this.maxPriceValidator.getErrorMessages();
    validationResult = false;
  }

  if (!this.locationValidator.isValid(latitude)) {
    this.errorMessages[ApiClientService.PARAM_LATITUDE_KEY] = this.locationValidator.getErrorMessages();
    validationResult = false;
  }

  if (!this.locationValidator.isValid(longitude)) {
    this.errorMessages[ApiClientService.PARAM_LONGITUDE_KEY] = this.locationValidator.getErrorMessages();
    validationResult = false;
  }

  if (!this.distanceValidator.isValid(distance)) {
    this.errorMessages[ApiClientService.PARAM_DISTANCE_KEY] = this.distanceValidator.getErrorMessages();
    validationResult = false;
  }

  return validationResult;
};

/**
 * Get error messages as associative array of parameter name => validation message.
 * @returns {Array}
 */
Demand.prototype.getErrorMessages = function() {
  return this.errorMessages;
};

module.exports = Demand;
