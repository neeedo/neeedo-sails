var util = require('util');

module.exports = {
  register: function (req, res) {
    var onErrorCallback = function (errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      RegisterService.prepareRegisterView(req, res, errorModel);
    };

    var onSuccessCallback = function (registeredUser) {
      var onLoggedInSuccess = function (loggedInUser) {
        res.redirect('/static/help');
      };
      LoginService.loginUser(req, onLoggedInSuccess, onErrorCallback);
    };

    if ("POST" == req.method) {
      RegisterService.registerUser(req, res, onSuccessCallback, onErrorCallback);
    } else {
      RegisterService.prepareRegisterView(req, res, undefined);
    }
  }
};
