/*
 * Favorites toggle service:
 * - button toggle event handling / delegate to AJAX backend
 * - display toggled favorite after response from backend
 */
var Favorites = function () {
  this.triggeredOfferIds = [];

  var _this = this;

  this.onToggleFavoriteClick = function () {
    var self = $(this);
    var offerId = self.data('offerid');

    if (-1 == _this.triggeredOfferIds.indexOf(offerId)) {
      _this.triggeredOfferIds.push(offerId);

      var favoritesRequest = new Favorites();
      favoritesRequest.toggleFavorite(
        {
          offerId: offerId
        },
        function (returnedData) {
          _this.toggleFavoriteInView(self)
        }
      )
    }
  };

  this.toggleFavoriteInView = function (favoriteEl) {
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

    _this.triggeredOfferIds = [];
  };
};

/**
 * Activate the toggle event handler (on the .toggleFavorite DOM elements).
 *
 * Call this method if the DOM changed.
 */
Favorites.prototype.activateEventHandler = function () {
  var toggleFavoriteLinkEl = $('.toggleFavorite');
  toggleFavoriteLinkEl.click(this.onToggleFavoriteClick);
};

/* ####################################
 * #
 * # Global scope
 * #
 * ####################################
 */
// store singleton in global scope
var favorites = new Favorites();

$(document).ready(function () {
  favorites.activateEventHandler();
});
