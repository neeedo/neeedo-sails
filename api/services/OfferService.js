var apiClient = require('neeedo-api-nodejs-client'),
    util = require('util');

var Offer = apiClient.models.Offer;
var OfferList = apiClient.models.OfferList;
var OfferService = apiClient.services.Offer;
var OfferListService = apiClient.services.OfferList;

module.exports = {
  /**
   * Load the currently logged in user's offers.
   * @param req
   * @param onSuccessCallback
   * @param onErrorCallback
   */
  loadUsersOffers: function(req, onSuccessCallback, onErrorCallback) {
    try {
      var offerListService = new OfferListService();
      offerListService.loadByUser(LoginService.getCurrentUser(req), onSuccessCallback, onErrorCallback);
    } catch (e) {
      onErrorCallback(ApiClientService.newError("loadUsersOffers:" + e.message, 'Your inputs were not valid.'));
    }
  },

  /**
   * Load the most recent demands.
   * @param req
   * @param onSuccessCallback
   * @param onErrorCallback
   */
  loadMostRecentOffers: function(req, onSuccessCallback, onErrorCallback) {
    try {
      // dummy demandlist
      var dummyOfferList = new OfferList();
      var dummyOffer = new Offer()
        .setId("1")
        .setTags(["socken", "bekleidung", "wolle"])
        .setLocation(ApiClientService.newLocation(parseFloat(35.92516), parseFloat(12.37528)))
        .setPrice(25.0);

      dummyOfferList
        .addOffer(dummyOffer)
        .addOffer(dummyOffer)
        .addOffer(dummyOffer)
        .addOffer(dummyOffer)
        .addOffer(dummyOffer)
        .addOffer(dummyOffer)
        .addOffer(dummyOffer)
        .addOffer(dummyOffer)
      ;
      onSuccessCallback(dummyOfferList);

      /* TODO delegate to api client service when available
       var demandListService = new DemandListService();
       demandListService.loadByUser(LoginService.getCurrentUser(req), onSuccessCallback, onErrorCallback);*/
    } catch (e) {
      onErrorCallback(ApiClientService.newError("loadMostRecentOffers:" + e.message, "The offers couldn't be loaded. Please contact Neeedo customer care."));
    }
  },

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
      req.session.offers = {};
    }

    req.session.offers[offerId] = offerModel;
  },

  storeListInSession: function(req, offersListModel) {
    for (var i=0; i < offersListModel.getOffers().length; i++) {
      OfferService.storeInSession(req, offersListModel.getOffers()[i]);
    }
  },

   removeFromSession: function(req, offerModel) {
     var offerId = offerModel.getId();
     if (this.isInSession(req, offerModel.getId())) {
       req.session.offers[offerId] = undefined;
     }
   },

  loadOffer: function(req, offerId, onLoadCallback, onErrorCallback) {
    if (this.isInSession(req, offerId)) {
      try {
        sails.log.info('Attempt to restore offer with ID ' + offerId + " from session.");

        var offer = new Offer();
        offer.loadFromSerialized(req.session.offers[offerId])
          .setUser(LoginService.getCurrentUser(req));

        onLoadCallback(offer);
      } catch (e) {
        onErrorCallBack(ApiClientService.newError("loadOffer:" + e.message, 'Could not restore offer from session.'));
      }
    } else {
      // load via API
      sails.log.info('Attempt to load offer with ID ' + offerId + " via API.");

      var offerService = new OfferService();
      offerService.load(offerId, LoginService.getCurrentUser(req), onLoadCallback, onErrorCallback);
    }
  },

  isInSession: function(req, offerId) {
    return "offers" in req.session && offerId in req.session.offers && undefined != req.session.offers[offerId];
  },

  getEditUrl: function(offerModel) {
    return 'offers/edit/offerId/' + offerModel.getId();
  },

  getDeleteUrl: function(offerModel) {
    return 'offers/delete/offerId/' + offerModel.getId();
  }


};
