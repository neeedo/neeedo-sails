var util = require('util');

module.exports = {
  login: function (req, res) {
    /*
     * ---------- callbacks ----------
     */
    var onSuccessCallback = function(loggedInUser) {
      if (ApiClientService.client.options.isDevelopment()) {
        sails.log.info("User " + util.inspect(loggedInUser, {
          showHidden: false,
          depth: null
        }) + " was logged in successfully.");
      }

      // delegate to LoginService to persist User (with his/her access token)
      LoginService.storeUserInSession(loggedInUser, req);

      res.view('login/login-success', {
        locals: {
          username: loggedInUser.getUsername(),
          email: loggedInUser.getEMail()
        }
      });
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
      var email = req.param("email");
      var password = req.param("password");

      LoginService.queryUser(email, password, onSuccessCallback, onErrorCallback);
    } else {
      res.view('login/login');
    }
  },
  logout: function (req, res) {
    LoginService.logoutUser(req);

    res.redirect('/login');
  }
}
