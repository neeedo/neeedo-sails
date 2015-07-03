var util = require('util');

module.exports = {
  ajaxToggleFavorite: function(req, res){
      var onSuccessCallback = function(favoriteModel) {
       res.status(200);
       res.json("OK");
      };


      FavoritesService.toggleFavorite(req, res, onSuccessCallback, FavoritesService.sendErrorResponse);
  },

  favoritesList: function(req, res) {
    res.view('favorites/favoritesList', {
      locals: {
        favoriteOffers: FavoritesService.getFavoriteOffers(req),
        pagination: PaginatorService.getSettings()
      }
    });
  }
};
