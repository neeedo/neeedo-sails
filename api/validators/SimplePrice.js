var _ = require('underscore');

function SimplePrice(translator, minAllowedPrice, maxAllowedPrice) {
  this.errorMessages = [];
  this.translator = translator;
  this.minAllowedPrice = minAllowedPrice;
  this.maxAllowedPrice = maxAllowedPrice;
}

SimplePrice.prototype.validateType = function(givenSimplePrice) {
  if (!_.isNumber(givenSimplePrice) || _.isNaN(givenSimplePrice)) {
    this.errorMessages.push(this.translator('Invalid value for price.'));
    return false;
  }

  return true;
};

SimplePrice.prototype.validateMinAndMax = function(givenSimplePrice) {
  if (givenSimplePrice < this.minAllowedPrice ) {
    this.errorMessages.push(this.translator("The minimum allowed price is %s", this.minAllowedPrice));
    return false;
  }

  if (givenSimplePrice > this.maxAllowedPrice) {
    this.errorMessages.push(this.translator("The maximum allowed price is %s", this.maxAllowedPrice));
    return false;
  }

  return true;
};

SimplePrice.prototype.isValid = function(givenSimplePrice)
{
  if (!this.validateType(givenSimplePrice)) {
    return false;
  }

  if (!this.validateMinAndMax(givenSimplePrice)) {
    return false;
  }

  return true;
};

SimplePrice.prototype.getErrorMessages = function() {
  return this.errorMessages.join(', ');
};

module.exports = SimplePrice;
