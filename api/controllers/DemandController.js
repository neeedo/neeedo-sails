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

    DemandService.loadDemand(req, res, onLoadSuccessCallback, onErrorCallback);
  },

  /**
   * Get action to get most recent demands by criteria, such as LatLng.
   * @param req
   * @param res
   */
  ajaxGet: function(req, res) {
     var onSuccessCallback = function(demandList) {
         DemandService.sendDemandListJsonResponse(req, res, demandList);
     };
     var onErrorCallback = function(errorModel) {
         DemandService.sendErrorJsonResponse(res, errorModel);
     };

     DemandService.loadMostRecentDemands(req, res, onSuccessCallback, onErrorCallback);
  },

  create: function (req, res) {
    var showFormWithDefaultValues = function() {
      var viewOptions = ViewService.mergeViewOptions(
        DemandService.getDefaultViewAndEditViewParameters(), {
          mustTags: "",
          shouldTags: "",
          minPrice: "",
          maxPrice: "",
          lat: "",
          lng: "",
          distance: 10,
          btnLabel: 'Create and find matching offers'
        });

      res.view('demand/create', {
        locals: viewOptions
      });
    };

    /*
     * ---------- callbacks ----------
     */
    var onSuccessCallback = function(createdDemand) {
      FlashMessagesService.setSuccessMessage('Your demand was created successfully.', req, res);
      DemandService.storeInSession(req, createdDemand);

      res.redirect(DemandService.getMatchingUrl(createdDemand));
    };

    var onErrorCallback = function(errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      if (errorModel.hasValidationMessages()) {
        DemandService.displayValidationMessages(req, res, errorModel, {
          viewPath: "demand/create",
            btnLabel: "Create and find matching offers"
        });
      } else {
        res.redirect(DemandService.getCreateUrl());
      }
    };

    /*
     * ---------- functionality ----------
     */
    if ("POST" == req.method) {
      DemandService.createDemand(req, res, onSuccessCallback, onErrorCallback);
    } else {
      showFormWithDefaultValues();
    }
  },

  edit: function (req, res) {
    /*
     * ---------- callbacks ----------
     */
    var onUpdateSuccessCallback = function(updatedDemand) {
      FlashMessagesService.setSuccessMessage('Your demand was updated successfully.', req, res);
      DemandService.storeInSession(req, updatedDemand);

      res.redirect(DemandService.getMatchingUrl(updatedDemand));
    };

    var onErrorCallback = function(errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      if (errorModel.hasValidationMessages()) {
        DemandService.displayValidationMessages(req, res, errorModel, {
          viewPath: "demand/edit",
          btnLabel: "Edit and find matching offers"
        });
      } else {
        res.redirect(DemandService.getCreateUrl());
      }
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

  ajaxMatching: function(req, res) {
    var onMatchCallback = function(offerList, actualDemand) {
      OfferService.sendOfferListJsonResponse(req, res, offerList, { demand: actualDemand });
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
      res.view('offer/matching', {
        locals: {
          offers: matchedOfferList.getOffers(),
          demand: currentDemand,
          showMap: {
            mapType: "demandMatching",
            demandMatchingSourceUrl: DemandService.getAjaxMatchingUrl(currentDemand)
          },
          demandMatchingSourceUrl: DemandService.getAjaxMatchingUrl(currentDemand),
          pagination: PaginatorService.getSettings()
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
