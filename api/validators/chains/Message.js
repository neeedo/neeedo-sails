var _ = require('underscore')
  ;

function Message(translator, messageValidationOptions) {
  this.errorMessages = [];
  this.translator = translator;
  this.messageBodyValidator = undefined;
  this.recipientIdValidator = undefined;
  this.initializeValidationChain = function() {
    // new message body validator
    this.messageBodyValidator = ValidationService.newMessageBodyValidator(translator, messageValidationOptions.messageBody.maxLength);

    // new ID validator
    this.recipientIdValidator = ValidationService.newIdValidator(translator);
  };

  this.initializeValidationChain();
};

Message.prototype.isValid = function(recipientId, messageBody)
{
  var validationResult = true;

  if (!this.recipientIdValidator.isValid(recipientId)) {
    this.errorMessages[ApiClientService.PARAM_RECIPIENT_ID_KEY] = this.recipientIdValidator.getErrorMessages();
    validationResult = false;
  }

  if (!this.messageBodyValidator.isValid(messageBody)) {
    this.errorMessages[ApiClientService.PARAM_MESSAGE_BODY_KEY] = this.messageBodyValidator.getErrorMessages();
    validationResult = false;
  }

  return validationResult;
};

/**
 * Get error messages as associative array of parameter name => validation message.
 * @returns {Array}
 */
Message.prototype.getErrorMessages = function() {
  return this.errorMessages;
};

module.exports = Message;
