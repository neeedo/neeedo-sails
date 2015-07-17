var _ = require('underscore');

function Location(translator) {
  this.errorMessages = [];
  this.translator = translator;
}

Location.prototype.validateType = function(givenCoordinate) {
  if (!_.isNumber(givenCoordinate) || _.isNaN(givenCoordinate)) {
    this.errorMessages.push(this.translator('Invalid value for coordinate.'));
    return false;
  }
  return true;
};

Location.prototype.isValid = function(givenCoordinate)
{
  var convertedCoordinate = parseFloat(givenCoordinate);

  if (!this.validateType(convertedCoordinate)) {
    return false;
  }

  return true;
};

Location.prototype.getErrorMessages = function() {
  return this.errorMessages.join(', ');
};

module.exports = Location;
