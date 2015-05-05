var apiClient = require('neeedo-api-nodejs-client');

var Login = apiClient.models.login;
var LoginService = apiClient.services.login;

module.exports = {
  /**
   * Login a given user.
   *
   * @param email
   * @param onSuccessCallback, will be called by the registered user instance delivered from neeedo API
   * @param onErrorCallBack, will be called with an HTTP response object on error
   */
  loginUser: function(email, onSuccessCallback, onErrorCallBack) {
     var loginModel = new Login();
     loginModel.setEMail(email);

     var loginService = new LoginService();
     loginService.loginUser(loginModel, onSuccessCallback, onErrorCallBack);
  }
};
