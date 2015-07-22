var util = require('util');

module.exports = {
  view: function(req, res) {
    var onErrorCallback = function(errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      res.redirect('/');
    };

    var onLoadSuccessCallback = function(loadedOffer) {
      res.view('offer/view', {
        locals: {
          offer : loadedOffer,
          showMap: {
            mapType: "showOffer",
            offerSourceUrl: OfferService.getSingleGetUrl(loadedOffer)
          }
        }
      });
    };

    OfferService.loadOffer(req, res, onLoadSuccessCallback, onErrorCallback);
  },

  /**
   * Get action to get most recent offers by criteria, such as LatLng.
   * @param req
   * @param res
   */
  ajaxGet: function(req, res) {
    var onSuccessCallback = function(offerList) {
      OfferService.sendOfferListJsonResponse(req, res, offerList, {});
    };
    var onErrorCallback = function(errorModel) {
      OfferService.sendErrorJsonResponse(res, errorModel);
    };

    OfferService.loadMostRecentOffers(req, res, onSuccessCallback, onErrorCallback);
  },

  ajaxGetSingle: function(req, res) {
    var onSuccessCallback = function(offer) {
      var offerList = ApiClientService.newOfferList();
      offerList.addOffer(offer);

      OfferService.sendOfferListJsonResponse(req, res, offerList, {});
    };
    var onErrorCallback = function(errorModel) {
      OfferService.sendErrorJsonResponse(res, errorModel);
    };

    OfferService.loadOffer(req, res, onSuccessCallback, onErrorCallback);

  },

  create: function (req, res) {
    var showFormWithDefaultValues = function() {
      var viewOptions = ViewService.mergeViewOptions(
        OfferService.getDefaultViewAndEditViewParameters(), {
            tags: "",
            price: "",
            lat: "",
            lng: "",
            images: FileService.getLeastUploadedFiles(req),
            btnLabel: 'Create'
        });

      sails.log.info(util.inspect(viewOptions, {depth: 5}));

      res.view('offer/create', {
        locals: viewOptions
      });
    };

    /*
     * ---------- callbacks ----------
     */
    var onSuccessCallback = function(createdOffer) {
      FlashMessagesService.setSuccessMessage('Your offer was created successfully.', req, res);
      OfferService.storeInSession(req, createdOffer);

      res.redirect(OfferService.getOverviewUrl());
    };

    var onErrorCallback = function(errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      if (errorModel.hasValidationMessages()) {
        OfferService.displayValidationMessages(req, res, errorModel, {
          viewPath: "offer/create",
          btnLabel: "Create"
        });
      } else {
        res.redirect(OfferService.getCreateUrl());
      }
    };

    /*
     * ---------- functionality ----------
     */
    if ("POST" == req.method) {
      OfferService.createOffer(req, res, onSuccessCallback, onErrorCallback);
    } else {
      showFormWithDefaultValues();
    }
  },

  edit: function (req, res) {
    /*
     * ---------- callbacks ----------
     */
    var onUpdateSuccessCallback = function(updatedOffer) {
      FlashMessagesService.setSuccessMessage('Your offer was updated successfully.', req, res);
      OfferService.storeInSession(req, updatedOffer);

      res.redirect(OfferService.getOverviewUrl());
    };

    var onErrorCallback = function(errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      if (errorModel.hasValidationMessages()) {
        OfferService.displayValidationMessages(req, res, errorModel, {
          viewPath: "offer/edit",
          btnLabel: "Edit"
        });
      } else {
        res.redirect(OfferService.getCreateUrl());
      }
    };

    OfferService.loadAndUpdateOffer(req, res, onUpdateSuccessCallback, onErrorCallback);
  },

  delete: function (req, res) {
    /*
     * ---------- callbacks ----------
     */
    var onDeleteSuccessCallback = function(deletedOffer) {
      FlashMessagesService.setSuccessMessage('Your offer was deleted successfully.', req, res);
      OfferService.removeFromSession(req, deletedOffer);

      res.redirect(OfferService.getOverviewUrl());
    };

    var onErrorCallback = function(errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      res.redirect(OfferService.getOverviewUrl());
    };

    OfferService.loadAndDeleteOffer(req, res, onDeleteSuccessCallback, onErrorCallback);
  }
}
