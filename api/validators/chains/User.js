var _ = require('underscore')
  ;

function User(translator, userValidationOptions) {
  this.errorMessages = [];
  this.translator = translator;
  this.usernameValidator = undefined;
  this.eMailValidator = undefined;
  this.passwordValidator = undefined;
  this.initializeValidationChain = function() {
    // new tags validator
    this.usernameValidator = ValidationService.newUsernameValidator(
      translator,
      userValidationOptions.username.minCount,
      userValidationOptions.username.maxCount
    );

    // new price validator
    this.eMailValidator = ValidationService.newEMailValidator(translator);

    // new location validator
    this.passwordValidator = ValidationService.newPasswordValidator(
      translator,
      userValidationOptions.password.minCount,
      userValidationOptions.password.maxCount
    );
  };

  this.initializeValidationChain();
};

User.prototype.isValid = function(username, eMail, password)
{
  var validationResult = true;

  if (!this.usernameValidator.isValid(username)) {
    this.errorMessages[ApiClientService.PARAM_USERNAME_KEY] = this.usernameValidator.getErrorMessages();
    validationResult = false;
  }

  if (!this.eMailValidator.isValid(eMail)) {
    this.errorMessages[ApiClientService.PARAM_EMAIL_KEY] = this.eMailValidator.getErrorMessages();
    validationResult = false;
  }

  if (!this.passwordValidator.isValid(password)) {
    this.errorMessages[ApiClientService.PARAM_PASSWORD_KEY] = this.passwordValidator.getErrorMessages();
    validationResult = false;
  }

  return validationResult;
};

/**
 * Get error messages as associative array of parameter name => validation message.
 * @returns {Array}
 */
User.prototype.getErrorMessages = function() {
  return this.errorMessages;
};

module.exports = User;
