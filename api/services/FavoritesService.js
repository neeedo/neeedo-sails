var apiClient = require('neeedo-api-nodejs-client');

var FavoritesService = apiClient.services.Favorite,
  FavoritesListService = apiClient.services.FavoriteList
  ;

module.exports = {
  toggleFavorite: function(req, onSuccessCallback, onErrorCallBack) {
      try {
        var favoritesService = new MessageService();
        var favoriteModel = ApiClientService.validateAndCreateNewFavoriteFromRequest(req, onErrorCallBack);
        var _this = this;

        var onToggleSuccessCallback = function(favoritesModel) {
          _this.loadUsersFavoriteOffers(req, function(favoriteOffers) {}, function(errorModel) {
            sails.log.error("Error while loading user's favorites: " + util.inspect(errorModel));
          });

          onSuccessCallback(favoritesModel);
        };
        favoritesService.toggleOfferFavorite(favoriteModel, onToggleSuccessCallback, onErrorCallBack);
      } catch (e) {
        onErrorCallBack(ApiClientService.newError("toggleFavorite:" + e.message, 'Your inputs were not valid.'));
      }
  },

  loadUsersFavoriteOffers: function (req, onSuccessCallback, onErrorCallBack) {
    try {
      if (!this.favoritesWereAlreadyLoadedInSession(req)) {
        var onFavoritesLoadedCallback = function(favoriteOfferList) {
          this.storeFavoriteOffersInSession(req, favoriteOfferList);

          onSuccessCallback(favoriteOfferList);
        };

        var favoritesListService = new FavoritesListService();

       /* favoritesListService.loadFavoritesOfUser(
          LoginService.getCurrentUser(req),
          ApiClientService.newOfferQueryFromRequest(req),
          onFavoritesLoadedCallback,
          onErrorCallBack);*/
      } else {
        onSuccessCallback(LoginService.getCurrentUser(req).getFavoriteOfferList());
      }
    } catch (e) {
      onErrorCallBack(ApiClientService.newError("loadUsersFavoriteOffers:" + e.message, 'Your inputs were not valid.'));
    }
  },

  favoritesWereAlreadyLoadedInSession: function(req) {
    return undefined !== LoginService.getCurrentUser(req).getFavoriteOfferList();
  },

  storeFavoriteOffersInSession: function(req, favoriteOfferList) {
    var user = LoginService.getCurrentUser(req);

    user.setFavoriteOfferList(favoriteOfferList);

    LoginService.storeUserInSession(user, req);
  },

  getFavoritesUrl: function() {
    return UrlService.to('/favorite-offers');
  }
}
;
