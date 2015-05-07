var apiClient = require('neeedo-api-nodejs-client');

var Register = apiClient.models.Register;
var RegisterService = apiClient.services.Register;

module.exports = {
  /**
   * Register as a new user.
   *
   * @param eMail
   * @param username
   * @param password
   * @param onSuccessCallback, will be called by the registered user instance delivered from neeedo API
   * @param onErrorCallBack, will be called with an HTTP response object on error
   */
  registerUser: function(email, username, password, onSuccessCallback, onErrorCallBack) {
     var registerModel = new Register();
     registerModel.setEMail(email).setUsername(username).setPassword(password);

     var registerService = new RegisterService();
     registerService.registerUser(registerModel, onSuccessCallback, onErrorCallBack);
  }
};
