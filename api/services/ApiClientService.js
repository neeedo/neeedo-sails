var apiClient = require('neeedo-api-nodejs-client')
    util = require('util');

var Location = apiClient.models.Location,
    Error = apiClient.models.Error
    DemandPrice = apiClient.models.DemandPrice;
  ;

module.exports = {
  client: apiClient,
  logMessages : function(errorModel) {
    for (var i = 0; i < errorModel.getLogMessages().length; i++) {
      sails.log.error(errorModel.getLogMessages()[i]);
    }
  },
  addFlashMessages : function(req, res, errorModel) {
    for (var i = 0; i < errorModel.getErrorMessages().length; i++) {
      FlashMessagesService.setErrorMessage(errorModel.getErrorMessages()[i], req, res);
    }
  },
  newLocation : function(lat, lng) {
    return new Location().setLatitude(lat).setLongitude(lng);
  },
  newDemandPrice : function(min, max) {
    return new DemandPrice().setMin(min).setMax(max);
  },
  toTagArray : function(tagStr) {
    // split by being "whitespace-friendly" (e.g. allow 'value1 , value2')
    return tagStr.split(/\s*,\s*/);
  },
  toTagString : function(tagArray) {
    return tagArray.join();
  },
  newError: function(messageForLog, messageForUser) {
   return new Error().addLogMessage(messageForLog).addErrorMessage(messageForUser);
  }
};
