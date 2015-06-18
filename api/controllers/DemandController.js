var util = require('util');

module.exports = {
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
          btnLabel: 'Create'
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

      res.redirect(DemandService.getEditUrl(createdDemand));
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
    var showFormWithDemandValues = function(loadedDemand) {
      res.view('demand/edit', {
        locals: {
          mustTags: ApiClientService.toTagString(loadedDemand.getMustTags()),
          shouldTags: ApiClientService.toTagString(loadedDemand.getShouldTags()),
          minPrice: loadedDemand.getPrice().getMin(),
          maxPrice: loadedDemand.getPrice().getMax(),
          lat: loadedDemand.getLocation().getLatitude(),
          lng: loadedDemand.getLocation().getLongitude(),
          distance: loadedDemand.getDistance(),
          btnLabel: 'Edit'
        }
      });
    };

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

      res.redirect(DemandService.getOverviewUrl());
    };

    var onErrorCallback = function(errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      res.redirect(DemandService.getOverviewUrl());
    };

    var onLoadSuccessCallback = function(loadedDemand) {
      sails.log.info("Demand " + util.inspect(loadedDemand, {
        showHidden: false,
        depth: null
      }) + " was loaded successfully.");

      if (!DemandService.setBelongsToCurrentUser(req, res, loadedDemand)) {
        return res.redirect(DemandService.getOverviewUrl());
      }

      if ("POST" == req.method) {
        DemandService.updateDemand(loadedDemand, req, onUpdateSuccessCallback, onErrorCallback);
      } else {
        if (undefined == loadedDemand) {
          FlashMessagesService.setErrorMessage('The demand could not be loaded.', req, res);
          return res.redirect(DemandService.getOverviewUrl());
        }

        showFormWithDemandValues(loadedDemand);
      }

    };

    var demandId = req.param("demandId");
    DemandService.loadDemand(req, demandId, onLoadSuccessCallback, onErrorCallback);
  },
  delete: function (req, res) {
    /*
     * ---------- callbacks ----------
     */
    var onDeleteSuccessCallback = function(deletedDemand) {
      sails.log.info("Demand " + util.inspect(deletedDemand, {
        showHidden: false,
        depth: null
      }) + " was deleted successfully.");

      FlashMessagesService.setSuccessMessage('Your demand was deleted successfully.', req, res);
      DemandService.removeFromSession(req, deletedDemand);

      res.redirect(DemandService.getOverviewUrl());;
    };

    var onErrorCallback = function(errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      res.redirect(DemandService.getOverviewUrl());;;
    };

    var onLoadSuccessCallback = function(loadedDemand) {
      sails.log.info("Demand " + util.inspect(loadedDemand, {
        showHidden: false,
        depth: null
      }) + " was loaded successfully.");

      if (!DemandService.setBelongsToCurrentUser(req, res, loadedDemand)) {
        return res.redirect(DemandService.getOverviewUrl());
      }

      DemandService.deleteDemand(loadedDemand, onDeleteSuccessCallback, onErrorCallback);
    };

    var demandId = req.param("demandId");
    DemandService.loadDemand(req, demandId, onLoadSuccessCallback, onErrorCallback);
  },

  matching: function(req, res) {
    /*
     * ---------- callbacks ----------
     */
    var onMatchCallback = function(matchedOfferList) {
      sails.log.info("Matched offers " + util.inspect(matchedOfferList, {
        showHidden: false,
        depth: null
      }));

      res.view('offer/matching', {
        locals: {
          offers: matchedOfferList.getOffers()
        }
      });
    };

    var onErrorCallback = function(errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      res.redirect(DemandService.getOverviewUrl());;
    };

    var onLoadSuccessCallback = function(loadedDemand) {
      sails.log.info("Demand " + util.inspect(loadedDemand, {
        showHidden: false,
        depth: null
      }) + " was loaded successfully.");


      DemandService.matchOffers(loadedDemand, req, onMatchCallback, onErrorCallback);
    };

    var demandId = req.param("demandId");
    DemandService.loadDemand(req, demandId, onLoadSuccessCallback, onErrorCallback);
  }
}
