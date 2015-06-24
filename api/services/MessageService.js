var apiClient = require('neeedo-api-nodejs-client');

var MessageService = apiClient.services.Message;

module.exports = {
  create: function (req, onSuccessCallback, onErrorCallBack) {
    try {
      var messageModel = ApiClientService.validateAndCreateNewMessageFromRequest(req, onErrorCallBack);

      var messageService = new MessageService();
      messageService.create(messageModel, onSuccessCallback, onErrorCallBack);
    } catch (e) {
      onErrorCallBack(ApiClientService.newError("createMessage:" + e.message, 'Your inputs were not valid.'));
    }
  },

  getCreateUrl: function() {
    return UrlService.to('/messages/create');
  },

  buildDefaultMessageForOffer: function(offer, req, res) {
    var msg = res.i18n("Hello %s", offer.getUser().getUsername())
        + ", \n"
        + res.i18n("I'm interested in your offer %s.",
          sails.getBaseurl() + OfferService.getViewUrl().replace("%%offerId%%", offer.getId()))
        + "\n"
        + res.i18n("Can you tell me something about it?")
        + "\n";

    if (LoginService.userIsLoggedIn(req)) {
      msg += res.i18n("Greetings, %s", LoginService.getCurrentUser(req).getUsername())
        + "\n";

    }
    
    return msg;
  }
};
