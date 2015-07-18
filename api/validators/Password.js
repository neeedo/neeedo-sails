var _ = require('underscore');

function Password(translator, minCount, maxCount) {
  this.errorMessages = [];
  this.minCount = minCount;
  this.maxCount = maxCount;
  // password must consist of at least one number, only alphanumerical + $*"';. are allowed
  this.regex = /^[a-zA-Z-_0-9$*"';.]*[0-9]{1,}[a-zA-Z-_0-9$*"';.]$*/;
  this.translator = translator;
}

Password.prototype.validateMinAndMax = function(givenPw) {
  if (givenPw.length < this.minCount ) {
    this.errorMessages.push(this.translator("The password must have at least %s characters", this.minCount));
    return false;
  }

  if (givenPw.length > this.maxDistance) {
    this.errorMessages.push(this.translator("The password must not have more than %s characters", this.maxCount));
    return false;
  }

  return true;
};

Password.prototype.validatePattern = function(givenPw) {
  if (!givenPw.match(this.regex) ) {
    this.errorMessages.push(this.translator("The password must consist of at least one number. Only alphanumerical characters and '_', '-', '$', '*', ''', ';', '.' are allowed."));
    return false;
  }

  return true;
};

Password.prototype.isValid = function(givenPw)
{
  if (!this.validateMinAndMax(givenPw)) {
    return false;
  }

  if (!this.validatePattern(givenPw)) {
    return false;
  }

  return true;
};

Password.prototype.getErrorMessages = function() {
  return this.errorMessages.join(', ');
};

module.exports = Password;
