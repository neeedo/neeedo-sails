var util = require('util');

module.exports = {
  register: function (req, res) {
    var onErrorCallback = function(errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      res.redirect('/register');
    };

    var onSuccessCallback = function(registeredUser) {
      var onLoggedInSuccess = function(loggedInUser) {
        res.redirect('/static/help');
      };
      LoginService.loginUser(req, onLoggedInSuccess, onErrorCallback);
    };

    if ("POST" == req.method) {
      RegisterService.registerUser(req, onSuccessCallback, onErrorCallback);
    } else {
      res.view('registration/register');
    }
  }
};
