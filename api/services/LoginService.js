var apiClient = require('neeedo-api-nodejs-client'),
    util = require('util');

var Login = apiClient.models.Login;
var LoginService = apiClient.services.Login;
var User = apiClient.models.User;

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
    // invalidate complete session
    req.session.destroy();
  },
  storeUserInSession: function(user, req)
  {
    if (user === null || typeof user !== 'object') {
      throw new Error("Type of user must be object.");
    }

    if (ApiClientService.client.options.isDevelopment()) {
      sails.log.info('Stored user in session');
    }

    req.session.user = user;
  },
  userIsLoggedIn: function(req) {
    if (undefined !== this.getCurrentUser(req)
      && undefined !== this.getCurrentUser(req).hasAccessToken()) {
      return true;
    }

    return false;
  },
  getCurrentUser: function(req) {
    if ("user" in req.session) {
      var user = new User();
      return user.loadFromSerialized(req.session.user);
    }

    return undefined;
  },
  redirectUserIfLoggedIn: function(req) {

  }
};
