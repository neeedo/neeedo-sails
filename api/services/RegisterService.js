var apiClient = require('neeedo-api-nodejs-client'),
  _ = require('underscore');

var Register = apiClient.models.Register;
var RegisterService = apiClient.services.Register;

module.exports = {
  /**
   * Register as a new user.
   *
   * @param req
   * @param res
   * @param onSuccessCallback , will be called by the registered user instance delivered from neeedo API
   * @param onErrorCallBack , will be called with an HTTP response object on error
   */
  registerUser: function (req, res, onSuccessCallback, onErrorCallBack) {
    //try {
      var registerModel = ApiClientService.validateAndCreateNewRegisterFromRequest(req, res, onErrorCallBack);

      if (undefined !== registerModel) {
        var registerService = new RegisterService();
        registerService.registerUser(registerModel, onSuccessCallback, onErrorCallBack);
      }
    /*} catch (e) {
      onErrorCallBack(ApiClientService.newError("registerUser:" + e.message, 'Your inputs were not valid.'));
    }*/
  },

  prepareRegisterView: function (req, res, errorModel) {
    var viewParameters = {
      btnLabel: 'Register',
      username: '',
      email: '',
      validationMessages: []
    };

    if (undefined !== errorModel
      && errorModel.hasValidationMessages()) {
      viewParameters['validationMessages'] = errorModel.getValidationMessages();

      for (var paramKey in errorModel.getOriginalParameters()) {
        var paramValue = errorModel.getOriginalParameters()[paramKey];

        viewParameters[paramKey] = paramValue;
      }
    }

    res.view('registration/register', {
      locals: viewParameters
    });
  }
};
