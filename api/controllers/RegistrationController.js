var util = require('util');

module.exports = {
  register: function (req, res) {
    var onSuccessCallback = function(registeredUser) {
      sails.log.info("User " + util.inspect(registeredUser, {
          showHidden: false,
          depth: null
        }) + " was registered successfully.");

      res.view('registration/register-success', {
        locals: {
          username: registeredUser.getUsername(),
          email: registeredUser.getEMail()
        }
      });
    };

    var onErrorCallback = function(errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      res.redirect('/register');
    };

    if ("POST" == req.method) {
      var username = req.param("username");
      var email = req.param("email");
      var password = req.param("password");

      RegisterService.registerUser(email, username, password, onSuccessCallback, onErrorCallback);
    } else {
      res.view('registration/register');
    }
  }
}
