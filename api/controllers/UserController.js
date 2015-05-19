var util = require('util');

module.exports = {
  /**
   * Build user's dashboard after he/she logged in or was redirected to it.
   * @param req
   * @param res
   */
  dashboard: function (req, res) {
    /*
     * ---------- callbacks ----------
     */
    var onLoadOffersSuccessCallback = function(usersOffers) {
      OfferService.storeListInSession(req, usersOffers);

      /**
       *  ---------- callbacks ----------
       */
      var onLoadCompleteCallback = function(usersDemands) {
        DemandService.storeListInSession(req, usersDemands);

        res.view('homepage', {
          locals: {
            demands: usersDemands,
            offers: usersOffers
          }
        });
      };

      var onDemandLoadErrorCallback = function(errorModel) {
        ApiClientService.logMessages(errorModel);
        ApiClientService.addFlashMessages(req, res, errorModel);

        res.view('homepage', {
          locals: {
            offers: usersOffers,
            demands: []
          }
        });
      };

      /*
       * ---------- functionality ----------
       */
      DemandService.loadUsersDemands(req, onLoadCompleteCallback, onDemandLoadErrorCallback);
    };


    var onErrorCallback = function(errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      res.view('homepage', {
        locals: {
          offers: [],
          demands: []
        }
      });
    };

    /*
     * ---------- functionality ----------
     */
    OfferService.loadUsersOffers(req, onLoadOffersSuccessCallback, onErrorCallback);
  }
}
