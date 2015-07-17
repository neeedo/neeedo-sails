var _ = require('underscore');

function Distance(translator, maxDistance) {
  this.errorMessages = [];
  this.maxDistance = maxDistance;
  this.translator = translator;
}

Distance.prototype.validateType = function(givenDistance) {
  if (!_.isNumber(givenDistance) || _.isNaN(givenDistance)) {
    this.errorMessages.push(this.translator('Invalid value for distance.'));

    return false;
  }

  return true;
};

Distance.prototype.validateMinAndMax = function(givenDistance) {
  if (givenDistance < 0 ) {
    this.errorMessages.push(this.translator("The minimum distance must be %s", 0));
    return false;
  }

  if (givenDistance > this.maxDistance) {
    this.errorMessages.push(this.translator("The maximum allowed distance is %s", this.maxDistance));
    return false;
  }

  return true;
};

Distance.prototype.isValid = function(givenDistance)
{
  var convertedDistance = parseInt(givenDistance);

  if (!this.validateType(convertedDistance)) {
    return false;
  }

  if (!this.validateMinAndMax(convertedDistance)) {
    return false;
  }

  return true;
};

Distance.prototype.getErrorMessages = function() {
  return this.errorMessages.join(', ');
};

module.exports = Distance;
