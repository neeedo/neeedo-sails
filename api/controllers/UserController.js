var util = require('util');

module.exports = {
  /**
   * Get action to get the current user's demands by criteria, such as pagination as JSON.
   * @param req
   * @param res
   */
  ajaxGetDemands: function(req, res) {
    var onSuccessCallback = function(demandList) {
      DemandService.sendDemandListJsonResponse(res, demandList);
    };
    var onErrorCallback = function(errorModel) {
      DemandService.sendErrorJsonResponse(res, errorModel);
    };

    DemandService.loadUsersDemands(req, onSuccessCallback, onErrorCallback);
  },

  /**
   * Get action to get the current user's offers by criteria, such as pagination as JSON.
   * @param req
   * @param res
   */
  ajaxGetOffers: function(req, res) {
    var onSuccessCallback = function(demandList) {
      DemandService.sendDemandListJsonResponse(res, demandList);
    };
    var onErrorCallback = function(errorModel) {
      DemandService.sendErrorJsonResponse(res, errorModel);
    };

    OfferService.loadUsersOffers(req, onSuccessCallback, onErrorCallback);
  },

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
            offers: usersOffers.getOffers(),
            showMap: false,
            offerSourceUrl: OfferService.getUsersOffersGetUrl(),
            demandSourceUrl: DemandService.getUsersDemandsGetUrl(),
            pagination: PaginatorService.getSettings()
          }
        });
      };

      var onDemandLoadErrorCallback = function(errorModel) {
        ApiClientService.logMessages(errorModel);
        ApiClientService.addFlashMessages(req, res, errorModel);

        res.view('homepage', {
          locals: {
            offers: usersOffers.getOffers(),
            demands: [],
            showMap: false,
            offerSourceUrl: OfferService.getUsersOffersGetUrl(),
            demandSourceUrl: DemandService.getUsersDemandsGetUrl(),
            pagination: PaginatorService.getSettings()
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
          demands: [],
          showMap: false,
          offerSourceUrl: OfferService.getUsersOffersGetUrl(),
          demandSourceUrl: DemandService.getUsersDemandsGetUrl(),
          pagination: PaginatorService.getSettings()
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
