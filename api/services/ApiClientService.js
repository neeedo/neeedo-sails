var apiClient = require('neeedo-api-nodejs-client');

module.exports = {
  client: apiClient,
  logMessages : function(errorModel) {
    for (var i = 0; i < errorModel.getLogMessages(); i++) {
      sails.log.error(errorModel.getLogMessages()[i]);
    }
  },
  addFlashMessages : function(req, errorModel) {
    for (var i = 0; i < errorModel.getErrorMessages(); i++) {
      req.flash('message', errorModel.getErrorMessages()[i]);
    }
  }
};
