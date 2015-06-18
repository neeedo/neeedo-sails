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
          offer : loadedOffer
        }
      });
    };

    OfferService.loadOffer(req, onLoadSuccessCallback, onErrorCallback);
  },

  /**
   * Get action to get most recent offers by criteria, such as LatLng.
   * @param req
   * @param res
   */
  ajaxGet: function(req, res) {
    var onSuccessCallback = function(offerList) {
      OfferService.sendOfferListJsonResponse(res, offerList);
    };
    var onErrorCallback = function(errorModel) {
      OfferService.sendErrorJsonResponse(res, errorModel);
    };

    OfferService.loadMostRecentOffers(req, onSuccessCallback, onErrorCallback);
  },

  create: function (req, res) {
    var showFormWithDefaultValues = function() {
      res.view('offer/create', {
        locals: {
          tags: "tag1, tag2,...",
          price: 10,
          lat: "",
          lng: "",
          images: FileService.getLeastUploadedFiles(req),
          btnLabel: 'Create'
        }
      });
    };

    /*
     * ---------- callbacks ----------
     */
    var onSuccessCallback = function(createdOffer) {
       sails.log.info("Offer " + util.inspect(createdOffer, {
          showHidden: false,
          depth: null
        }) + " was created successfully.");

      FlashMessagesService.setSuccessMessage('Your offer was created successfully.', req, res);
      OfferService.storeInSession(req, createdOffer);

      res.redirect(OfferService.getOverviewUrl());
    };

    var onErrorCallback = function(errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      res.redirect(OfferService.getOverviewUrl());
    };

    /*
     * ---------- functionality ----------
     */
    if ("POST" == req.method) {
      OfferService.createOffer(req, onSuccessCallback, onErrorCallback);
    } else {
      showFormWithDefaultValues();
    }
  },
  edit: function (req, res) {
    var showFormWithOfferValues = function(offerModel) {
      res.view('offer/edit', {
        locals: {
          tags: ApiClientService.toTagString(offerModel.getTags()),
          price: offerModel.getPrice(),
          lat: offerModel.getLocation().getLatitude(),
          lng: offerModel.getLocation().getLongitude(),
          images: FileService.getLeastUploadedFilesAndCurrentOnes(req, offerModel.getImageList()),
          btnLabel: 'Edit'
        }
      });
    };
    /*
     * ---------- callbacks ----------
     */
    var onUpdateSuccessCallback = function(updatedOffer) {
      sails.log.info("Offer " + util.inspect(updatedOffer, {
        showHidden: false,
        depth: null
      }) + " was updated successfully.");

      FlashMessagesService.setSuccessMessage('Your offer was updated successfully.', req, res);
      OfferService.storeInSession(req, updatedOffer);

      res.redirect(OfferService.getOverviewUrl());
    };

    var onErrorCallback = function(errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      res.redirect(OfferService.getOverviewUrl());
    };

    var onLoadSuccessCallback = function(loadedOffer) {
      sails.log.info("Offer " + util.inspect(loadedOffer, {
        showHidden: false,
        depth: null
      }) + " was loaded successfully.");

      if (!OfferService.setBelongsToCurrentUser(req, res, loadedOffer)) {
        return res.redirect(OfferService.getOverviewUrl());
      }

      if ("POST" == req.method) {
        OfferService.updateOffer(loadedOffer, req, onUpdateSuccessCallback, onErrorCallback);
      } else {
        if (undefined == loadedOffer) {
          FlashMessagesService.setErrorMessage('The offer could not be loaded.', req, res);
          return res.redirect(OfferService.getOverviewUrl());
        }

        showFormWithOfferValues(loadedOffer);
      }

    };

    OfferService.loadOffer(req, onLoadSuccessCallback, onErrorCallback);
  },
  delete: function (req, res) {
    /*
     * ---------- callbacks ----------
     */
    var onDeleteSuccessCallback = function(deletedOffer) {
      sails.log.info("Offer " + util.inspect(deletedOffer, {
        showHidden: false,
        depth: null
      }) + " was deleted successfully.");

      FlashMessagesService.setSuccessMessage('Your offer was deleted successfully.', req, res);
      OfferService.removeFromSession(req, deletedOffer);

      res.redirect(OfferService.getOverviewUrl());
    };

    var onErrorCallback = function(errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      res.redirect(OfferService.getOverviewUrl());
    };

    var onLoadSuccessCallback = function(loadedOffer) {
      sails.log.info("Offer " + util.inspect(loadedOffer, {
        showHidden: false,
        depth: null
      }) + " was loaded successfully.");

      if (!OfferService.setBelongsToCurrentUser(req, res, loadedOffer)) {
        return res.redirect(OfferService.getOverviewUrl());
      }

      OfferService.deleteOffer(loadedOffer, onDeleteSuccessCallback, onErrorCallback);
    };

    OfferService.loadOffer(req, onLoadSuccessCallback, onErrorCallback);
  }
}
