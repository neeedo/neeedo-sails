var _ = require('underscore');

function Location(translator) {
  this.errorMessages = [];
  this.translator = translator;
}

Location.prototype.validateType = function(givenLocation) {
  if (!_.isObject(givenLocation)) {
    this.errorMessages.push(this.translator('Invalid value for location.'));
    
    return false;
  }

  return true;
};

Location.prototype.isValid = function(givenLocation)
{
  if (!this.validateType(givenLocation)) {
    return false;
  }

  return true;
};

Location.prototype.getErrorMessages = function() {
  return this.errorMessages.join(', ');
};

module.exports = Location;
