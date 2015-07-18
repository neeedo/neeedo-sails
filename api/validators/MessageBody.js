var _ = require('underscore');

function MessageBody(translator, maxLength) {
  this.errorMessages = [];
  this.maxLength = maxLength;

  this.translator = translator;
}

MessageBody.prototype.validateLength = function(givenMessage) {
  if (givenMessage.length > this.maxLength ) {
    this.errorMessages.push(this.translator("The message must not exceed %s characters", this.maxLength));
    return false;
  }

  return true;
};

MessageBody.prototype.isValid = function(givenMessage)
{
  if (!this.validateLength(givenMessage)) {
    return false;
  }

  return true;
};

MessageBody.prototype.getErrorMessages = function() {
  return this.errorMessages.join(', ');
};

module.exports = MessageBody;
