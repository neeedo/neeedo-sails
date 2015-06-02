var util = require('util');

module.exports = {
  create: function (req, res) {
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
      var tags = req.param("tags");
      var price = req.param("price");
      var lat = req.param("lat");
      var lng = req.param("lng");

      OfferService.createOffer(tags, lat, lng, price, LoginService.getCurrentUser(req), onSuccessCallback, onErrorCallback);
    } else {
      res.view('offer/create', {
        locals: {
          tags: "tag1, tag2,...",
          price: 10,
          lat: 35.92516,
          lng: 12.37528,
          btnLabel: 'Create'
        }
      });
    }
  },
  edit: function (req, res) {
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

      if (OfferService.belongsToCurrentUser(req, loadedOffer)) {
        loadedOffer.setUser(LoginService.getCurrentUser(req));
      } else {
        FlashMessagesService.setErrorMessage('You cannot edit offers of other users.', req, res);
        return res.redirect(OfferService.getOverviewUrl());
      }

      if ("POST" == req.method) {
        var tags = req.param("tags");
        var price = req.param("price");
        var lat = req.param("lat");
        var lng = req.param("lng");

        OfferService.updateOffer(loadedOffer, tags, lat, lng, price, onUpdateSuccessCallback, onErrorCallback);
      } else {
        if (undefined == loadedOffer) {
          FlashMessagesService.setErrorMessage('The offer could not be loaded.', req, res);
          return res.redirect(OfferService.getOverviewUrl());
        }

        res.view('offer/edit', {
          locals: {
            tags: ApiClientService.toTagString(loadedOffer.getTags()),
            price: loadedOffer.getPrice(),
            lat: loadedOffer.getLocation().getLatitude(),
            lng: loadedOffer.getLocation().getLongitude(),
            btnLabel: 'Edit'
          }
        });
      }

    };

    var offerId = req.param("offerId");
    OfferService.loadOffer(req, offerId, onLoadSuccessCallback, onErrorCallback);
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

      if (OfferService.belongsToCurrentUser(req, loadedOffer)) {
        loadedOffer.setUser(LoginService.getCurrentUser(req));
      } else {
        FlashMessagesService.setErrorMessage('You cannot delete offers of other users.', req, res);
        return res.redirect(OfferService.getOverviewUrl());
      }

      OfferService.deleteOffer(loadedOffer, onDeleteSuccessCallback, onErrorCallback);
    };

    var offerId = req.param("offerId");
    OfferService.loadOffer(req, offerId, onLoadSuccessCallback, onErrorCallback);
  },
  uploadImage: function (req, res) {

  }
}
