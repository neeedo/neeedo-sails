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
    var favorites = FavoritesService.getFavoriteOffers(req);

    if (0 == favorites.length) {
      // redirect to homepage with most recent demands + offers
      FlashMessagesService.setSuccessMessage("You didn't add any favorite offer yet.", req, res);
      res.redirect('/');
    } else {
      res.view('favorites/favoritesList', {
        locals: {
          favoriteOffers: FavoritesService.getFavoriteOffers(req),
          pagination: PaginatorService.getSettings()
        }
      });
    }
  }
};
