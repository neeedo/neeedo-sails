var util = require('util');

module.exports = {
  ajaxToggleFavorite: function(req, res){
      var onSuccessCallback = function(favoriteModel) {
       res.status(200);
       res.json("OK");
      };

      var onErrorCallback = function(errorModel) {
        res.status(400);
      };

      FavoritesService.toggleFavorite(req, onSuccessCallback, onErrorCallback);
  },

  favoritesList: function(req, res) {
    res.view('favorites/favoritesList', {
      locals: {
        favoriteOffers: LoginService.getCurrentUser(req).getFavoriteOfferList().getOffers(),
        pagination: PaginatorService.getSettings()
      }
    });
  }
};
