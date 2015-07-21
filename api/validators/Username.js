var _ = require('underscore');

function Username(translator, minCount, maxCount) {
  this.errorMessages = [];
  this.minCount = minCount;
  this.maxCount = maxCount;
  // name musn't contain a whitespace
  this.regex = /[^\s]$/;
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
    this.errorMessages.push(this.translator("Your username mustn't have a whitespace."));
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
