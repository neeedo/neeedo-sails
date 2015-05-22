module.exports = {
  index: function (req, res) {
    /*
     * ---------- callbacks ----------
     */
    var onLoadOffersSuccessCallback = function(mostRecentOffers) {
      //OfferService.storeListInSession(req, mostRecentOffers);

      /**
       *  ---------- callbacks ----------
       */
      var onLoadCompleteCallback = function(mostRecentDemands) {
        //DemandService.storeListInSession(req, mostRecentDemands);

        res.view('homepage', {
          locals: {
            demands: mostRecentDemands.getDemands(),
            offers: mostRecentOffers.getOffers()
          }
        });
      };

      var onDemandLoadErrorCallback = function(errorModel) {
        ApiClientService.logMessages(errorModel);
        ApiClientService.addFlashMessages(req, res, errorModel);

        res.view('homepage', {
          locals: {
            offers: mostRecentOffers.getOffers(),
            demands: []
          }
        });
      };

      /*
       * ---------- functionality ----------
       */
      DemandService.loadMostRecentDemands(req, onLoadCompleteCallback, onDemandLoadErrorCallback);
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
    OfferService.loadMostRecentOffers(req, onLoadOffersSuccessCallback, onErrorCallback);
  }
}
