var _ = require('underscore');

function Distance(translator) {
  this.errorMessages = [];
  this.translator = translator;
}

Distance.prototype.validateType = function(givenDistance) {
  if (!_.isNumber(givenDistance)) {
    this.errorMessages.push(this.translator('Invalid value for distance.'));

    return false;
  }

  return true;
};

Distance.prototype.isValid = function(givenDistance)
{
  if (!this.validateType(givenDistance)) {
    return false;
  }

  return true;
};

Distance.prototype.getErrorMessages = function() {
  return this.errorMessages.join(', ');
};

module.exports = Distance;
