var _ = require('underscore');

function Id(translator) {
  this.errorMessages = [];
  this.translator = translator;
  this.regex = /^[a-zA-Z0-9-]+$/;
}

Id.prototype.isValid = function(givenId)
{
  if (!_.isString(givenId)
    || !givenId.match(this.regex)) {
    this.errorMessages.push(this.translator("Invalid ID given."));

    return false;
  }

  return true;
};

Id.prototype.getErrorMessages = function() {
  return this.errorMessages.join(', ');
};

module.exports = Id;
