var _ = require('underscore');

function Username(translator, minCount, maxCount) {
  this.errorMessages = [];
  this.minCount = minCount;
  this.maxCount = maxCount;
  // username must consist of at least one alphanum character and may contain numbers, "_" and "-"
  this.regex = /^[a-zA-Z]+[a-zA-Z0-9-_]*$/;
  this.translator = translator;
}

Username.prototype.validateMinAndMax = function(givenUsername) {
  if (givenUsername.length < this.minCount ) {
    this.errorMessages.push(this.translator("The username must have at least %s characters", this.minCount));
    return false;
  }

  if (givenUsername.length > this.maxCount) {
    this.errorMessages.push(this.translator("The username must not have more than %s characters", this.maxCount));
    return false;
  }

  return true;
};

Username.prototype.validatePattern = function(givenUsername) {
  if (!givenUsername.match(this.regex) ) {
    this.errorMessages.push(this.translator("The username must consist of alphanumerical characters, '-' or '_' and must contain at least one alpha character."));
    return false;
  }

  return true;
};

Username.prototype.isValid = function(givenUsername)
{
  if (!this.validateMinAndMax(givenUsername)) {
    return false;
  }

  if (!this.validatePattern(givenUsername)) {
    return false;
  }

  return true;
};

Username.prototype.getErrorMessages = function() {
  return this.errorMessages.join(', ');
};

module.exports = Username;
