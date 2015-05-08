var util = require('util');

module.exports = {
  create: function (req, res) {
    /*
     * ---------- callbacks ----------
     */
    var onSuccessCallback = function(loggedInUser) {
      if (ApiClientService.client.options.isDevelopment()) {
        console.log("User " + util.inspect(loggedInUser, {
          showHidden: false,
          depth: null
        }) + " was logged in successfully.");
      }

      // delegate to LoginService to persist User (with his/her access token)
      LoginService.storeUserInSession(loggedInUser, req);

      res.view('Users/login-success', {
        locals: {
          username: loggedInUser.getUsername(),
          email: loggedInUser.getEMail()
        }
      });
    };

    var onErrorCallback = function(response) {
      if ('statusCode' in response) {
        console.log("Error during login: NEEEDO API sent response status " + response.statusCode);
      } else {
        console.log("Exception during login: " + response);
      }

      req.flash('message', 'login_no_success');
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
      res.view('Users/login');
    }
  },
  update: function (req, res) {

  },
  delete: function (req, res) {

  },
  uploadImage: function (req, res) {

  }
}
