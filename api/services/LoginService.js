var apiClient = require('neeedo-api-nodejs-client');

var Login = apiClient.models.login;
var LoginService = apiClient.services.login;

module.exports = {
  /**
   * Query a given user.
   *
   * @param email
   * @param password
   * @param onSuccessCallback, will be called by the registered user instance delivered from neeedo API
   * @param onErrorCallBack, will be called with an HTTP response object on error
   */
  queryUser: function(email, password, onSuccessCallback, onErrorCallBack) {
     var loginModel = new Login();
     loginModel.setEMail(email);
     loginModel.setPassword(password);

     var loginService = new LoginService();
     loginService.loginUser(loginModel, onSuccessCallback, onErrorCallBack);
  },
  logoutUser: function(req)
  {
    req.session.user = undefined;
  },
  storeUserInSession: function(user, req)
  {
    if (user === null || typeof user !== 'object') {
      throw new Error("Type of user must be object.");
    }

    req.session.user = user;
  },
  userIsLoggedIn: function(req) {
    if ("user" in req.session && undefined !== req.session.user) {
      return true;
    }

    return false;
  }
};
