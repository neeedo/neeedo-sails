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

      res.redirect(OfferService.getEditUrl(createdOffer));
    };

    var onErrorCallback = function(errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      res.redirect('/offer/create');
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
      res.view('offer/create');
    }
  },
  edit: function (req, res) {
    /*
     * ---------- callbacks ----------
     */
    var onSuccessCallback = function(updatedOffer) {
      sails.log.info("Offer " + util.inspect(updatedOffer, {
        showHidden: false,
        depth: null
      }) + " was created successfully.");

      FlashMessagesService.setSuccessMessage('Your offer was updated successfully.', req, res);
      OfferService.storeInSession(req, updatedOffer);

      res.view('offer/edit', {

      });
    };

    var onErrorCallback = function(errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      res.redirect('/offer/edit');
    };

    var offerId = req.param("id");

    var offer = OfferService.loadOffer(req, offerId);

    if (undefined == offer) {
      FlashMessagesService.setErrorMessage('The offer could not be loaded.', req, res);
      return req.redirect('/');
    }

    OfferService.updateOffer(offer, onSuccessCallback, onErrorCallback);
  },
  delete: function (req, res) {
    /*
     * ---------- callbacks ----------
     */
    var onSuccessCallback = function(deletedOffer) {
      sails.log.info("Offer " + util.inspect(deletedOffer, {
        showHidden: false,
        depth: null
      }) + " was deleted successfully.");

      FlashMessagesService.setSuccessMessage('Your offer was deleted successfully.', req, res);
      OfferService.removeFromSession(req, deletedOffer);

      res.view('/', {

      });
    };

    var onErrorCallback = function(errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      res.redirect('/');
    };

    var offerId = req.param("id");

    var offer = OfferService.loadOffer(req, offerId);

    if (undefined == offer) {
      FlashMessagesService.setErrorMessage('The offer could not be loaded.', req, res);
      return req.redirect('/');
    }

    OfferService.deleteOffer(offer, onSuccessCallback, onErrorCallback);
  },
  uploadImage: function (req, res) {

  }
}
