var util = require('util');

module.exports = {
  view: function(req, res) {
    var onErrorCallback = function(errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      res.redirect('/');
    };

    var onLoadSuccessCallback = function(loadedDemand) {
      res.view('demand/view', {
        locals: {
          demand : loadedDemand
         }
      });
    };

    DemandService.loadDemand(req, onLoadSuccessCallback, onErrorCallback);
  },

  /**
   * Get action to get most recent demands by criteria, such as LatLng.
   * @param req
   * @param res
   */
  ajaxGet: function(req, res) {
     var onSuccessCallback = function(demandList) {
         DemandService.sendDemandListJsonResponse(res, demandList);
     };
     var onErrorCallback = function(errorModel) {
         DemandService.sendErrorJsonResponse(res, errorModel);
     };

     DemandService.loadMostRecentDemands(req, onSuccessCallback, onErrorCallback);
  },

  create: function (req, res) {
    var showFormWithDefaultValues = function() {
      res.view('demand/create', {
        locals: {
          mustTags: "tag1, tag2,...",
          shouldTags: "tag1, tag2,...",
          minPrice: 0,
          maxPrice: 50,
          lat: "",
          lng: "",
          distance: 30,
          btnLabel: 'Create and find matching offers'
        }
      });
    };

    /*
     * ---------- callbacks ----------
     */
    var onSuccessCallback = function(createdDemand) {
       sails.log.info("demand " + util.inspect(createdDemand, {
          showHidden: false,
          depth: null
        }) + " was created successfully.");

      FlashMessagesService.setSuccessMessage('Your demand was created successfully.', req, res);
      DemandService.storeInSession(req, createdDemand);

      res.redirect(DemandService.getMatchingUrl(createdDemand));
    };

    var onErrorCallback = function(errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      res.redirect('/demand/create');
    };

    /*
     * ---------- functionality ----------
     */
    if ("POST" == req.method) {
      DemandService.createDemand(req, onSuccessCallback, onErrorCallback);
    } else {
      showFormWithDefaultValues();
    }
  },

  edit: function (req, res) {
    /*
     * ---------- callbacks ----------
     */
    var onUpdateSuccessCallback = function(updatedDemand) {
      sails.log.info("Demand " + util.inspect(updatedDemand, {
        showHidden: false,
        depth: null
      }) + " was created successfully.");

      FlashMessagesService.setSuccessMessage('Your demand was updated successfully.', req, res);
      DemandService.storeInSession(req, updatedDemand);

      res.redirect(DemandService.getMatchingUrl(updatedDemand));
    };

    var onErrorCallback = function(errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      res.redirect(DemandService.getOverviewUrl());
    };

    DemandService.loadAndUpdateDemand(req, res, onUpdateSuccessCallback, onErrorCallback);
  },

  delete: function (req, res) {
    /*
     * ---------- callbacks ----------
     */
    var onDeleteSuccessCallback = function(deletedDemand) {

      FlashMessagesService.setSuccessMessage('Your demand was deleted successfully.', req, res);
      DemandService.removeFromSession(req, deletedDemand);

      res.redirect(DemandService.getOverviewUrl());;
    };

    var onErrorCallback = function(errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      res.redirect(DemandService.getOverviewUrl());;;
    };

    DemandService.loadAndDeleteDemand(req, res, onDeleteSuccessCallback, onErrorCallback);
  },

  matchingAjax: function(req, res) {
    var onMatchCallback = function(offerList) {
      OfferService.sendOfferListJsonResponse(res, offerList);
    };

    var onErrorCallback = function(errorModel) {
      DemandService.sendErrorJsonResponse(res, errorModel);
    };

    DemandService.loadAndMatchOffers(req, res, onMatchCallback, onErrorCallback);
  },

  matching: function(req, res) {
    /*
     * ---------- callbacks ----------
     */
    var onMatchCallback = function(matchedOfferList, currentDemand) {
      sails.log.info("Matched offers " + util.inspect(matchedOfferList, {
        showHidden: false,
        depth: null
      }));

      if (0 == matchedOfferList.getOffers().length) {
        FlashMessagesService.setErrorMessage("Sorry, we couldn't find any matching offers. Please try to specify your demand better.", req, res);
        return res.redirect(DemandService.getEditUrl(currentDemand));
      }

      res.view('offer/matching', {
        locals: {
          offers: matchedOfferList.getOffers(),
          demand: currentDemand
        }
      });
    };

    var onErrorCallback = function(errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      res.redirect(DemandService.getOverviewUrl());
    };

    DemandService.loadAndMatchOffers(req, res, onMatchCallback, onErrorCallback);
  }
}
