var _ = require('underscore');

function Email(translator) {
  this.errorMessages = [];
  this.regex = /^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$/;
  this.translator = translator;
}

Email.prototype.validatePattern = function(givenMail) {
  if (!givenUsername.match(this.regex) ) {
    this.errorMessages.push(this.translator("You entered an invalid eMail address."));
    return false;
  }

  return true;
};

Email.prototype.isValid = function(givenMail)
{
  if (!this.validatePattern(givenMail)) {
    return false;
  }

  return true;
};

Email.prototype.getErrorMessages = function() {
  return this.errorMessages.join(', ');
};

module.exports = Email;
