var _ = require('underscore');

function DemandPrice(translator, minAllowedPrice, maxAllowedPrice) {
  this.errorMessages = [];
  this.translator = translator;
  this.regex = /^[a-zA-Z0-9-_]+$/;
  this.minAllowedPrice = minAllowedPrice;
  this.maxAllowedPrice = maxAllowedPrice;
}

DemandPrice.prototype.validateType = function(givenDemandPrice) {
  if (!_.isObject(givenDemandPrice)) {
    this.errorMessages.push(this.translator('Invalid value for demand price.'));
    return false;
  }

  return true;
};

DemandPrice.prototype.validateMinAndMaxForMinPrice = function(givenDemandPrice) {
  if (givenDemandPrice.getMin() < this.minAllowedPrice ) {
    this.errorMessages.push(this.translator("The minimum allowed minimum price is %s", this.minAllowedPrice));
    return false;
  }

  if (givenDemandPrice.getMin() > this.maxAllowedPrice) {
    this.errorMessages.push(this.translator("The maximum allowed minimum price is %s", this.maxAllowedPrice));
    return false;
  }

  return true;
};

DemandPrice.prototype.validateMinAndMaxForMaxPrice = function(givenDemandPrice) {
  if (givenDemandPrice.getMax() < this.minAllowedPrice ) {
    this.errorMessages.push(this.translator("The minimum allowed maximum price is %s", this.minAllowedPrice));
    return false;
  }

  if (givenDemandPrice.getMax() > this.maxAllowedPrice) {
    this.errorMessages.push(this.translator("The maximum allowed maximum price is %s", this.maxAllowedPrice));
    return false;
  }

  return true;
};

DemandPrice.prototype.isValid = function(givenDemandPrice)
{
  if (!this.validateType(givenDemandPrice)) {
    return false;
  }

  if (!this.validateMinAndMaxForMinPrice(givenDemandPrice)) {
    return false;
  }

  if (!this.validateMinAndMaxForMaxPrice(givenDemandPrice)) {
    return false;
  }

  return true;
};

DemandPrice.prototype.getErrorMessages = function() {
  return this.errorMessages.join(', ');
};

module.exports = DemandPrice;
