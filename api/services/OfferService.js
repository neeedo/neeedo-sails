var apiClient = require('neeedo-api-nodejs-client'),
    util = require('util');

var Offer = apiClient.models.Offer;
var OfferService = apiClient.services.Offer;

module.exports = {
  /**
   * Query a given user.
   *
   * @param tags
   * @param latitude
   * @param longitude
   * @param price
   * @param onSuccessCallback will be called by the registered user instance delivered from neeedo API
   * @param onErrorCallBack will be called with an HTTP response object on error
   */
  createOffer: function(tags, latitude, longitude, price, user, onSuccessCallback, onErrorCallBack) {
    try {
      var offerModel = new Offer();
      offerModel.setTags(ApiClientService.toTagArray(tags))
        .setLocation(ApiClientService.newLocation(parseFloat(latitude), parseFloat(longitude)))
        .setPrice(parseFloat(price))
        .setUser(user);

      var offerService = new OfferService();
      offerService.createOffer(offerModel, onSuccessCallback, onErrorCallBack);
    } catch (e) {
      onErrorCallBack(ApiClientService.newError("createOffer:" + e.message, 'Your inputs were not valid.'));
    }
  },

  updateOffer: function(offerModel, tags, latitude, longitude, price, onSuccessCallback, onErrorCallBack) {
    try {
      offerModel.setTags(ApiClientService.toTagArray(tags))
        .setLocation(ApiClientService.newLocation(parseFloat(latitude), parseFloat(longitude)))
        .setPrice(parseFloat(price));

      var offerService = new OfferService();
      offerService.updateOffer(offerModel, onSuccessCallback, onErrorCallBack);
    } catch (e) {
      onErrorCallBack(ApiClientService.newError("updateOffer:" + e.message, 'Your inputs were not valid.'));
    }

  },

  deleteOffer: function(offerModel, onSuccessCallback, onErrorCallBack) {
    try {
      var offerService = new OfferService();
      offerService.deleteOffer(offerModel, onSuccessCallback, onErrorCallBack);
    } catch (e) {
      onErrorCallBack(ApiClientService.newError("deleteOffer:" + e.message, 'Your inputs were not valid.'));
    }

  },

  storeInSession: function(req, offerModel) {
    var offerId = offerModel.getId();

    if (! ("offers" in req.session)) {
      sails.log.info("storing offer in session: " + util.inspect(offerModel));
      req.session.offers = {};
    }

    req.session.offers[offerId] = offerModel;
  },

   removeFromSession: function(req, offerModel) {
     var offerId = offerModel.getId();
     if (this.isInSession(req, offerModel.getId())) {
       req.sesseion.offers[offerId] = undefined;
     }
   },

  loadOffer: function(req, offerId) {
    if (this.isInSession(req, offerId)) {
      var offer =  new Offer();
          offer.loadFromSerialized(req.session.offers[offerId])
        .setUser(LoginService.getCurrentUser(req));

      sails.log.info("loaded offer from session: \n" + util.inspect(offer));

      return offer;
    }

    sails.log.info("could not load offer with id " + offerId + " from session:\nOffer Session content:\n" + util.inspect(req.session.offers));
    return undefined;
  },

  isInSession: function(req, offerId) {
    return offerId in req.session.offers && undefined != req.session.offers[offerId];
  },

  getEditUrl: function(offerModel) {
    return 'offers/edit/offerId/' + offerModel.getId();
  },

  getDeleteUrl: function(offerModel) {
    return 'offers/delete/offerId/' + offerModel.getId();
  }


};
