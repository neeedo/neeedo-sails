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

  updateOffer: function(offerModel, onSuccessCallback, onErrorCallBack) {
    try {
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
      sails.log.info("setting offers in session");
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
      return req.session.offers[offerId];
    }

    return undefined;
  },

  isInSession: function(req, offerId) {
    return offerId in req.session.offers && undefined != req.session.offers[offerId];
  },

  getEditUrl: function(offerModel) {
    return 'offer/edit/id/' + offerModel.getId();
  },

  getDeleteUrl: function(offerModel) {
    return 'offer/delete/id/' + offerModel.getId();
  }


};
