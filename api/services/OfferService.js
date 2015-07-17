var apiClient = require('neeedo-api-nodejs-client'),
    util = require('util');

var Offer = apiClient.models.Offer;
var OfferList = apiClient.models.OfferList;
var ClientOfferService = apiClient.services.Offer;
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
      var offerQuery = ApiClientService.newOfferQueryFromRequest(req);
      var offerListService = new OfferListService();

      offerListService.loadByUser(LoginService.getCurrentUser(req), offerQuery, onSuccessCallback, onErrorCallback);
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
      var offerQuery = ApiClientService.newOfferQueryFromRequest(req);
      var offerListService = new OfferListService();

      offerListService.loadMostRecent(offerQuery, onSuccessCallback, onErrorCallback);
    } catch (e) {
      onErrorCallback(ApiClientService.newError("loadMostRecentOffers:" + e.message, "The offers couldn't be loaded. Please contact Neeedo customer care."));
    }
  },

  /**
   * Query a given user.
   *
   * @param req
   * @param onSuccessCallback will be called by the registered user instance delivered from neeedo API
   * @param onErrorCallBack will be called with an HTTP response object on error
   */
  createOffer: function(req, res, onSuccessCallback, onErrorCallBack) {
    try {
      var offerModel = ApiClientService.validateAndCreateNewOfferFromRequest(req, res);
      var offerService = new ClientOfferService();

      offerService.createOffer(offerModel, onSuccessCallback, onErrorCallBack);
    } catch (e) {
      onErrorCallBack(ApiClientService.newError("createOffer:" + e.message, 'Your inputs were not valid.'));
    }
  },

  loadAndUpdateOffer: function(req, res, onUpdateSuccessCallback, onErrorCallback) {
    var showFormWithOfferValues = function(offerModel) {
      res.view('offer/edit', {
        locals: {
          tags: ApiClientService.toTagString(offerModel.getTags()),
          price: offerModel.getPrice(),
          lat: offerModel.getLocation().getLatitude(),
          lng: offerModel.getLocation().getLongitude(),
          images: FileService.getLeastUploadedFilesAndCurrentOnes(req, offerModel.getImageList()),
          btnLabel: 'Edit'
        }
      });
    };

    var onLoadSuccessCallback = function(loadedOffer) {
      if (!OfferService.setBelongsToCurrentUser(req, res, loadedOffer)) {
        return res.redirect(OfferService.getOverviewUrl());
      }

      if ("POST" == req.method) {
        OfferService.updateOffer(loadedOffer, req, res, onUpdateSuccessCallback, onErrorCallback);
      } else {
        if (undefined == loadedOffer) {
          FlashMessagesService.setErrorMessage('The offer could not be loaded.', req, res);
          return res.redirect(OfferService.getOverviewUrl());
        }

        showFormWithOfferValues(loadedOffer);
      }

    };

    this.loadOffer(req, res, onLoadSuccessCallback, onErrorCallback);
  },

  updateOffer: function(offerModel, req, res, onSuccessCallback, onErrorCallBack) {
    try {
      ApiClientService.validateAndSetOfferFromRequest(req, res, offerModel, offerModel.getUser(), onErrorCallBack);

      var offerService = new ClientOfferService();
      offerService.updateOffer(offerModel, onSuccessCallback, onErrorCallBack);
    } catch (e) {
      onErrorCallBack(ApiClientService.newError("updateOffer:" + e.message, 'Your inputs were not valid.'));
    }
  },

  loadAndDeleteOffer: function(req, res, onDeleteSuccessCallback, onErrorCallback) {
    var onLoadSuccessCallback = function(loadedOffer) {
      if (!OfferService.setBelongsToCurrentUser(req, res, loadedOffer)) {
        return res.redirect(OfferService.getOverviewUrl());
      }

      OfferService.deleteOffer(loadedOffer, onDeleteSuccessCallback, onErrorCallback);
    };

    this.loadOffer(req, res, onLoadSuccessCallback, onErrorCallback);
  },

  deleteOffer: function(offerModel, onSuccessCallback, onErrorCallBack) {
    try {
      var offerService = new ClientOfferService();
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

  loadOffer: function(req, res, onLoadCallback, onErrorCallback) {
    var offerId = ApiClientService.validateAndCreateNewOfferIdFromRequest(req, res, onErrorCallback);

    if (undefined !== offerId) {
      if (this.isInSession(req, offerId)) {
        try {
          sails.log.info('Attempt to restore offer with ID ' + offerId + " from session: session content " +
          util.inspect(req.session.offers[offerId], {
            showHidden: false,
            depth: null
          }));

          var offer = new Offer();
          offer.loadFromSerialized(req.session.offers[offerId]);

          onLoadCallback(offer);
        } catch (e) {
          onErrorCallback(ApiClientService.newError("loadOffer:" + e.message, 'Could not restore offer from session.'));
        }
      } else {
        // load via API
        sails.log.info('Attempt to load offer with ID ' + offerId + " via API.");

        var offerService = new ClientOfferService();
        offerService.load(offerId, LoginService.getCurrentUser(req), onLoadCallback, onErrorCallback);
      }
    }
  },

  isInSession: function(req, offerId) {
    return "offers" in req.session && offerId in req.session.offers && undefined != req.session.offers[offerId];
  },

  getCreateUrl: function() {
    return UrlService.to('/offers/create');
  },

  getEditUrl: function(offerModel) {
    if (undefined == offerModel.getId()) {
      return '/';
    }

    return UrlService.to('/offers/edit/offerId/' + offerModel.getId());
  },

  getViewUrl: function() {
    return UrlService.to('/offers/view/offerId/%%offerId%%');
  },

  getViewUrlForOffer: function(offer) {
    return this.getViewUrl().replace("%%offerId%%", offer.getId());
  },

  getDeleteUrl: function(offerModel) {
    if (undefined == offerModel.getId()) {
      return '/';
    }

    return UrlService.to('/offers/delete/offerId/' + offerModel.getId());
  },

  getOverviewUrl: function(demandModel) {
    return UrlService.to('/dashboard');
  },

  getOffersGetUrl: function() {
    return UrlService.to('/offers/ajax-get');
  },

  getUsersOffersGetUrl: function() {
    return UrlService.to('/user/ajax-get-offers');
  },

  getSingleGetUrl: function(loadedOffer) {
    return UrlService.to('/offers/ajax-get-single?offerId=' + loadedOffer.getId());
  },

  belongsToCurrentUser: function(req, offer) {
    return (LoginService.userIsLoggedIn(req)
      && undefined != offer.getUser()
      && LoginService.getCurrentUser(req).getId() == offer.getUser().getId());
  },

  setBelongsToCurrentUser: function(req, res, offer)
  {
    if (this.belongsToCurrentUser(req, offer)) {
      offer.setUser(LoginService.getCurrentUser(req));
      return true;
    } else {
      FlashMessagesService.setErrorMessage('You cannot edit offers of other users.', req, res);
      return false;
    }
  },

  getFirstImage : function(offer)
  {
    if(offer.getImages().length > 0 ) {
      var firstImage = offer.getImages()[0];

      return {
        path : FileService.filterGetImageUrl(firstImage.getUrl()),
        altText : firstImage.getFileName()
      };
    } else {
      return {
        path : "/images/Offer_Dummy.png",
        altText : 'Dummy'
      };
    }
  },

  sendOfferListJsonResponse: function(req, res, offerList, additionalJson)
  {
    res.status(200);

    this.appendHtmlIfDesired(offerList, req, res, function () {
      res.json({
        offerList: offerList,
        additionalJson : additionalJson
      });
    });
  },

  /**
   * Iterate over each demand in the given list and append the rendered HTML to the field 'html'.
   *
   * Use the partial offersForList.js which are used in the sliders.
   *
   * @param offerList
   * @param req
   * @param res
   * @param callback
   */
  appendHtmlIfDesired: function (offerList, req, res, callback) {
    // check if getHtml parameter is given in request
    var getHtml = req.param('getHtml', undefined);
    var displayFavorite = ('true' == req.param('displayFavorite') ? true : false);

    if (getHtml && offerList.getOffers().length > 0) {
      var counter = 0;

      _.each(offerList.getOffers(), function (offer) {
          ViewService.renderView(
            "partials/offersForList",
            {
              offer: offer,
              req: req,
              i18n: res.i18n,
              displayFavorite: displayFavorite
            },
            function (html) {
              counter++;

              offer.html = html;

              if (counter == offerList.getOffers().length) {
                // all demands were appended by rendered partial
                callback();
              }
            })
        }
      );
    } else {
      // do not append
      callback();
    }
  },

  /**
   * Send JSON error response.
   *
   * @param res
   * @param errorModel , see neeedo-api-nodejs-client
   */
  sendErrorJsonResponse: function(res, errorModel)
  {
    sails.log.error('OfferService:sendErrorJsonResponse(): ' + errorModel.getLogMessages()[0]);
    res.status(400);

    res.json({
      message : errorModel.getErrorMessages()[0]
    });
  }

};

