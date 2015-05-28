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
            demands: usersDemands.getDemands(),
            offers: usersOffers.getOffers()
          }
        });
      };

      var onDemandLoadErrorCallback = function(errorModel) {
        ApiClientService.logMessages(errorModel);
        ApiClientService.addFlashMessages(req, res, errorModel);

        res.view('homepage', {
          locals: {
            offers: usersOffers.getOffers(),
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
  },

  setLocale: function(req, res) {
     var locale = req.param("locale");

     if (LocaleService.isValidLocale(locale)) {
       LocaleService.saveUsersPreferedLocale(res, locale);
       LocaleService.setUsersPreferedLocaleInRequest(req, locale);

       //FlashMessagesService.setSuccessMessage('Your locale was set.', req, res);
       if (!UrlService.redirectToLastRedirectUrl(req, res)) {
         return res.redirect('/dashboard');
       }

       return;
     }

     sails.log.error('Attempt to set unavailable locale ' + locale);
     FlashMessagesService.setErrorMessage("We couldn't set your prefered locale.", req, res);
     return res.redirect(LocaleService.getRedirectUrl());
  }
}
