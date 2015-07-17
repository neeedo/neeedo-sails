var _ = require('underscore')
  ;

function Offer(translator, offerValidationOptions) {
  this.errorMessages = [];
  this.translator = translator;
  this.tagsValidator = undefined;
  this.simplePriceValidator = undefined;
  this.locationValidator = undefined;
  this.minNumberOfImages = offerValidationOptions.images.minCount;
  this.maxNumberOfImages = offerValidationOptions.images.maxCount;

  this.initializeValidationChain = function() {
    // new tags validator
    this.tagsValidator = ApiClientService.newTagsValidator(
      translator,
      offerValidationOptions.tags.minCount,
      offerValidationOptions.tags.maxCount
    );

    // new price validator
    this.simplePriceValidator = ApiClientService.newSimplePriceValidator(
      translator,
      offerValidationOptions.price.minimum,
      offerValidationOptions.price.maximum
    );

    // new location validator
    this.locationValidator = ApiClientService.newLocationValidator(translator);
  };

  this.initializeValidationChain();
};

Offer.prototype.validateImages = function(images)
{
  if (0 == this.minNumberOfImages && (undefined === images
    || !_.isArray(images))) {
    // allow no images
    return true;
  }

  if (images.length < this.minNumberOfImages) {
    this.errorMessages.push(this.translator('You need to upload at least %s images', this.minNumberOfImages));

    return false;
  }

  if (images.length > this.maxNumberOfImages) {
    this.errorMessages.push(this.translator('You uploaded too many images.'));

    return false;
  }

  return true;
};

Offer.prototype.isValid = function(tags, simplePrice, latitude, longitude, images)
{
  var validationResult = true;

  if (!this.tagsValidator.isValid(tags)) {
    this.errorMessages[ApiClientService.PARAM_TAGS_KEY] = this.tagsValidator.getErrorMessages();
    validationResult = false;
  }

  if (!this.simplePriceValidator.isValid(simplePrice)) {
    this.errorMessages[ApiClientService.PARAM_SIMPLE_PRICE_KEY] = this.simplePriceValidator.getErrorMessages();
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

  if (!this.validateImages(images)) {
    this.errorMessages[ApiClientService.PARAM_IMAGES_KEY] = this.getErrorMessages();
    validationResult = false;
  }

  return validationResult;
};

/**
 * Get error messages as associative array of parameter name => validation message.
 * @returns {Array}
 */
Offer.prototype.getErrorMessages = function() {
  return this.errorMessages;
};

module.exports = Offer;
