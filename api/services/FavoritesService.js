var apiClient = require('neeedo-api-nodejs-client');

var
  FavoritesService = apiClient.services.Favorite,
  ClientOfferService = apiClient.services.Offer,
  FavoritesListService = apiClient.services.FavoriteList
  ;

module.exports = {
  toggleFavorite: function (req, res, onSuccessCallback, onErrorCallBack) {
    try {
      var favoritesService = new FavoritesService();
      var favoriteModel = ApiClientService.validateAndCreateNewFavoriteFromRequest(req, onErrorCallBack);

      var _this = this;
      var onToggleSuccessCallback = function (favoritesModel) {
        if (favoritesService.wasAdded) {
          _this.addFavoriteOfferToSession(req, res, favoriteModel, onSuccessCallback, onErrorCallBack);
        } else if (favoritesService.wasRemoved) {
          _this.removeFavoriteOfferFromSession(req, res, favoriteModel, onSuccessCallback, onErrorCallBack);
        }
      };

      var onToggleErrorCallback = function(errorModel) {
        onErrorCallBack(req, res, errorModel);
      };

      favoritesService.toggleOfferFavorite(favoriteModel, onToggleSuccessCallback, onToggleErrorCallback);
    } catch (e) {
      onErrorCallBack(req, res, ApiClientService.newError("toggleFavorite:" + e.message, 'Your inputs were not valid.'));
    }
  },

  loadUsersFavoriteOffers: function (req, onSuccessCallback, onErrorCallBack) {
    try {
      var _this = this;
      if (!this.favoritesWereAlreadyLoadedInSession(req)) {
        var onFavoritesLoadedCallback = function (favoriteOfferList) {
          _this.storeFavoriteOffersInSession(req, favoriteOfferList);

          onSuccessCallback(favoriteOfferList);
        };

        var favoritesListService = new FavoritesListService();

        favoritesListService.loadFavoritesOfUser(
         LoginService.getCurrentUser(req),
         ApiClientService.newOfferQueryFromRequest(req),
         onFavoritesLoadedCallback,
         onErrorCallBack);
      } else {
        onSuccessCallback(LoginService.getCurrentUser(req).getFavoriteOfferList());
      }
    } catch (e) {
      onErrorCallBack(ApiClientService.newError("loadUsersFavoriteOffers:" + e.message, 'Your inputs were not valid.'));
    }
  },

  favoritesWereAlreadyLoadedInSession: function (req) {
    return undefined !== LoginService.getCurrentUser(req).getFavoriteOfferList();
  },

  storeFavoriteOffersInSession: function (req, favoriteOfferList) {
    var user = LoginService.getCurrentUser(req);

    user.setFavoriteOfferList(favoriteOfferList);

    LoginService.storeUserInSession(user, req);
  },

  addFavoriteOfferToSession: function (req, res, favoriteModel, onSuccessCallback, onErrorCallback) {
    var user = LoginService.getCurrentUser(req);

    if (!this.favoritesWereAlreadyLoadedInSession(req)) {
      user.setFavoriteOfferList(ApiClientService.newOfferList());
    }

    var _this = this;
    // load offer
    var clientOfferService = new ClientOfferService();
    clientOfferService.load(
      favoriteModel.getOffer().getId(),
      user,
      function (loadedOffer) {
        user.getFavoriteOfferList().addOffer(loadedOffer);
        _this.storeFavoriteOffersInSession(req, user.getFavoriteOfferList());

        onSuccessCallback(favoriteModel);
      },
      function (errorModel) {
        onErrorCallback(req, res, errorModel);
      }
    )

  },

  removeFavoriteOfferFromSession: function (req, res, favoriteModel, onSuccessCallback, onErrorCallback) {
    var user = LoginService.getCurrentUser(req);

    if (!this.favoritesWereAlreadyLoadedInSession(req)) {
      onSuccessCallback(favoriteModel);
    } else {
      var newOfferList = ApiClientService.newOfferList();
      for (var i=0; i < user.getFavoriteOfferList().getOffers().length; i++) {
        var offer = user.getFavoriteOfferList().getOffers()[i];

        if (offer.getId() != favoriteModel.getOffer().getId()) {
          newOfferList.addOffer(offer);
        }
      }

      this.storeFavoriteOffersInSession(req, newOfferList);
      onSuccessCallback(favoriteModel);
    }
  },

  getFavoritesUrl: function () {
    return UrlService.to('/favorite-offers');
  },

  getFavoriteOffers: function (req) {
    var favoriteOfferList = undefined !== LoginService.getCurrentUser(req).getFavoriteOfferList()
      ? LoginService.getCurrentUser(req).getFavoriteOfferList()
      : ApiClientService.newOfferList();

    return favoriteOfferList.getOffers();
  },

  sendErrorResponse: function (req, res, errorModel) {
    sails.log.error(undefined != errorModel ? errorModel.getLogMessages().join("\n") : 'Error in FavoritesService:sendErrorresponse');

    res.status(400);
    res.json("Error : " + undefined != errorModel ? errorModel.getErrorMessages().join('.') : '');
  }
}
;
