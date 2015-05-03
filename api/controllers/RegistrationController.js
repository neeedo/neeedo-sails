module.exports = {
  registration: function (req, res) {
    var onSuccessCallback = function(registeredUser) {
      console.log("User " + registeredUser + " was registered successfully.");

      // show registration success view TODO

      res.view('Users/success', {
        username: registeredUser.getUsername(),
        email: registeredUser.getEMail()
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

      RegisterService.registerUser(email, username, password, this.onSuccessCallback, this.onErrorCallback);
    } else {
      res.view('Users/registration');
    }
  }
}
