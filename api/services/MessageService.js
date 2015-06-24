module.exports = {
  getCreateUrl: function() {
    return UrlService.to('/messages/create');
  },

  buildDefaultMessageForOffer: function(offer, res) {
    return res.i18n("Hello %s", offer.getUser().getUsername())
        + ", \n"
        + res.i18n("I'm interested in your offer %s.",
          sails.getBaseurl() + OfferService.getViewUrl().replace("%%offerId%%", offer.getId()))
        + "\n"
        + res.i18n("Can you tell me something about it?")
        + "\n"
      ;
  }
};
