var util = require('util');

module.exports = {
  registration: function (req, res) {
    var onSuccessCallback = function(registeredUser) {
      if (ApiClientService.client.options.isDevelopment()) {
        console.log("User " + util.inspect(registeredUser, {
          showHidden: false,
          depth: null
        }) + " was registered successfully.");
      }

      // show registration success view TODO

      res.view('Users/success', {
        locals: {
          username: registeredUser.getUsername(),
          email: registeredUser.getEMail()
        }
      });
    };

    var onErrorCallback = function(response) {
      if ('statusCode' in response) {
        console.log("Error during registration: NEEEDO API sent response status " + response.statusCode);
      } else {
        console.log("Exception during registration: " + response);
      }

      req.flash('message', 'technical_error_on_registration');
      res.redirect('/register');
    };

    if ("POST" == req.method) {
      var username = req.param("username");
      var email = req.param("email");
      var password = req.param("password");

      RegisterService.registerUser(email, username, password, onSuccessCallback, onErrorCallback);
    } else {
      res.view('Users/registration');
    }
  }
}
