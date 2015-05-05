var util = require('util');

module.exports = {
  login: function (req, res) {
    var onSuccessCallback = function(loggedInUser) {
      if (ApiClientService.client.options.isDevelopment()) {
        console.log("User " + util.inspect(loggedInUser, {
          showHidden: false,
          depth: null
        }) + " was logged in successfully.");
      }

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

    if ("POST" == req.method) {
      var email = req.param("email");

      LoginService.loginUser(email, onSuccessCallback, onErrorCallback);
    } else {
      res.view('Users/login');
    }
  }
}
