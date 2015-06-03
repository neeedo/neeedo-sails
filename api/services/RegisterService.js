var apiClient = require('neeedo-api-nodejs-client');

var Register = apiClient.models.Register;
var RegisterService = apiClient.services.Register;

module.exports = {
  /**
   * Register as a new user.
   *
   * @param req
   * @param onSuccessCallback , will be called by the registered user instance delivered from neeedo API
   * @param onErrorCallBack , will be called with an HTTP response object on error
   */
  registerUser: function(req, onSuccessCallback, onErrorCallBack) {
     var registerModel = ApiClientService.validateAndCreateNewRegisterFromRequest(req, onErrorCallBack);

     var registerService = new RegisterService();
     registerService.registerUser(registerModel, onSuccessCallback, onErrorCallBack);
  }
};
