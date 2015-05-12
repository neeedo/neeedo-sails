var apiClient = require('neeedo-api-nodejs-client');

module.exports = {
  client: apiClient,
  logMessages : function(errorModel) {
    for (var i = 0; i < errorModel.getLogMessages(); i++) {
      sails.log.error(errorModel.getLogMessages()[i]);
    }
  },
  addFlashMessages : function(req, res, errorModel) {
    for (var i = 0; i < errorModel.getErrorMessages().length; i++) {
      req.flash('message', res.i18n(errorModel.getErrorMessages()[i]));
    }
  }
};
