var util = require('util');

module.exports = {
  login: function (req, res) {
    /*
     * ---------- callbacks ----------
     */
    var onSuccessCallback = function(loggedInUser) {
       sails.log.info("User " + util.inspect(loggedInUser, {
          showHidden: false,
          depth: null
        }) + " was logged in successfully.");

      // delegate to LoginService to persist User (with his/her access token)
      LoginService.storeUserInSession(loggedInUser, req);

      if (!LoginService.redirectToAfterLoginUrl(req, res)) {
        res.redirect('/dashboard');
      }
    };

    var onErrorCallback = function(errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      res.redirect('/login');
    };

    /*
     * ---------- functionality ----------
     */
    if ("POST" == req.method) {
      LoginService.queryUser(req, onSuccessCallback, onErrorCallback);
    } else {
      res.view('login/login');
    }
  },

  logout: function (req, res) {
    LoginService.logoutUser(req);

    res.redirect('/');
  }
}
