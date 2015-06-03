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
   * @param onSuccessCallback will be called by the registered user instance delivered from neeedo API
   * @param onErrorCallBack will be called with an error object
   */
  queryUser: function(req, onSuccessCallback, onErrorCallBack) {
    try {
      var loginModel = ApiClientService.validateAndCreateNewLoginFromRequest(req, onErrorCallBack);

      var loginService = new LoginService();
      loginService.loginUser(loginModel, onSuccessCallback, onErrorCallBack);
    } catch (e) {
      onErrorCallBack(ApiClientService.newError("queryUser:" + e.message, "login_internal_error"));
    }
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

    sails.log.info('Stored user in session');

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

  redirectToAfterLoginUrl: function(req, res) {
    return UrlService.redirectToLastRedirectUrl(req, res);
  }
};
