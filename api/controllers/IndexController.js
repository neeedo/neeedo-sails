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
            offers: mostRecentOffers.getOffers(),
            offerSourceUrl: OfferService.getOffersGetUrl(),
            demandSourceUrl: DemandService.getDemandsGetUrl(),
            showMap: {
              mapType: "all",
              demandSourceUrl: DemandService.getDemandsGetUrl(),
              offerSourceUrl: OfferService.getOffersGetUrl()
            },
            pagination: PaginatorService.getSettings()
          }
        });
      };

      var onDemandLoadErrorCallback = function(errorModel) {
        ApiClientService.logMessages(errorModel);
        ApiClientService.addFlashMessages(req, res, errorModel);

        res.view('homepage', {
          locals: {
            offers: mostRecentOffers.getOffers(),
            demands: [],
            offerSourceUrl: OfferService.getOffersGetUrl(),
            demandSourceUrl: DemandService.getDemandsGetUrl(),
            showMap: {
              mapType: "all",
              demandSourceUrl: DemandService.getDemandsGetUrl(),
              offerSourceUrl: OfferService.getOffersGetUrl()
            },
            pagination: PaginatorService.getSettings()
          }
        });
      };

      /*
       * ---------- functionality ----------
       */
      DemandService.loadMostRecentDemands(req, res, onLoadCompleteCallback, onDemandLoadErrorCallback);
    };


    var onErrorCallback = function(errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      res.view('homepage', {
        locals: {
          offers: [],
          demands: [],
          offerSourceUrl: OfferService.getOffersGetUrl(),
          demandSourceUrl: DemandService.getDemandsGetUrl(),
          showMap: {
            mapType: "all",
            demandSourceUrl: DemandService.getDemandsGetUrl(),
            offerSourceUrl: OfferService.getOffersGetUrl()
          },
          pagination: PaginatorService.getSettings()
        }
      });
    };

    /*
     * ---------- functionality ----------
     */
    OfferService.loadMostRecentOffers(req, res, onLoadOffersSuccessCallback, onErrorCallback);
  }
}
