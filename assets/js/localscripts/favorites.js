var triggeredOfferIds = [];

$(document).ready(function () {
  var toggleFavoriteLinkEl = $('.toggleFavorite');

  var toggleFavoriteInView = function(favoriteEl) {
    var iconEl = favoriteEl.find('.favoriteIcon');

    if (-1 != iconEl.attr('class').indexOf('isFavorite')) {
      // the offer was favorite before, now it is unfavorited
      iconEl.removeClass('isFavorite');
      iconEl.removeClass('icon-star-full');

      iconEl.addClass('isNotFavorite');
      iconEl.addClass('icon-star-empty');
    } else {
      // the offer was not a favorite before, now it is favorited
      iconEl.removeClass('isNotFavorite');
      iconEl.removeClass('icon-star-empty');

      iconEl.addClass('isFavorite');
      iconEl.addClass('icon-star-full');
    }

    triggeredOfferIds = [];
  };

  toggleFavoriteLinkEl.click(function() {
    var _this = $(this);
    var offerId = _this.data('offerid');

    if (-1 == triggeredOfferIds.indexOf(offerId)) {
      triggeredOfferIds.push(offerId);

      var favoritesRequest = new Favorites();
      favoritesRequest.toggleFavorite(
        {
          offerId: offerId
        },
        function (returnedData) {
          toggleFavoriteInView(_this)
        }
      )
    }
  });
});
