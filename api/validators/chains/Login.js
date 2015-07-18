var _ = require('underscore')
  ;

function Login(translator, userValidationOptions) {
  this.errorMessages = [];
  this.translator = translator;
  this.eMailValidator = undefined;
  this.passwordValidator = undefined;
  this.initializeValidationChain = function() {
    // new mail validator
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

Login.prototype.isValid = function(eMail, password)
{
  var validationResult = true;

  if (!this.eMailValidator.isValid(eMail)) {
    this.errorMessages[ApiClientService.PARAM_EMAIL_KEY] = this.eMailValidator.getErrorMessages();
    validationResult = false;
  }

  /* Password validation is disabled since many old passwords might have less characters.
  if (!this.passwordValidator.isValid(password)) {
    this.errorMessages[ApiClientService.PARAM_PASSWORD_KEY] = this.passwordValidator.getErrorMessages();
    validationResult = false;
  }*/

  return validationResult;
};

/**
 * Get error messages as associative array of parameter name => validation message.
 * @returns {Array}
 */
Login.prototype.getErrorMessages = function() {
  return this.errorMessages;
};

module.exports = Login;
