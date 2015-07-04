var util = require('util');

module.exports = {
  login: function (req, res) {
    /*
     * ---------- callbacks ----------
     */
    var onSuccessCallback = function(loggedInUser) {
      if (!LoginService.redirectToAfterLoginUrl(req, res)) {
        res.redirect('/dashboard');
      }
    };

    var onErrorCallback = function(errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      res.redirect('/register');
    };

    /*
     * ---------- functionality ----------
     */
    if ("POST" == req.method) {
      LoginService.loginUser(req, onSuccessCallback, onErrorCallback);
    } else {
      res.view('login/login');
    }
  },

  logout: function (req, res) {
    LoginService.logoutUser(req);

    res.redirect('/');
  }
}
