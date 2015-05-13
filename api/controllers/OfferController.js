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
    var onSuccessCallback = function(updatedOffer) {
      sails.log.info("Offer " + util.inspect(updatedOffer, {
        showHidden: false,
        depth: null
      }) + " was created successfully.");

      FlashMessagesService.setSuccessMessage('Your offer was updated successfully.', req, res);
      OfferService.storeInSession(req, updatedOffer);

      res.view('offer/edit',{
        locals: {
          tags: ApiClientService.toTagString(updatedOffer.getTags()),
          price: updatedOffer.getPrice(),
          lat: updatedOffer.getLocation().getLatitude(),
          lng: updatedOffer.getLocation().getLongitude()
        }
      });
    };

    var onErrorCallback = function(errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      res.redirect('/offer/edit');
    };

    var offerId = req.param("offerId");
    var offer = OfferService.loadOffer(req, offerId);

    if ("POST" == req.method) {
      var tags = req.param("tags");
      var price = req.param("price");
      var lat = req.param("lat");
      var lng = req.param("lng");

      OfferService.updateOffer(offer, tags, lat, lng, price, onSuccessCallback, onErrorCallback);
    } else {
      if (undefined == offer) {
        FlashMessagesService.setErrorMessage('The offer could not be loaded.', req, res);
        return res.redirect('/');
      }

      res.view('offer/edit', {
        locals: {
          tags: ApiClientService.toTagString(offer.getTags()),
          price: offer.getPrice(),
          lat: offer.getLocation().getLatitude(),
          lng: offer.getLocation().getLongitude(),
          btnLabel: 'Edit'
        }
        });
    }
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

      res.redirect('/');
    };

    var onErrorCallback = function(errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      res.redirect('/');
    };

    var offerId = req.param("offerId");

    var offer = OfferService.loadOffer(req, offerId);

    if (undefined == offer) {
      FlashMessagesService.setErrorMessage('The offer could not be loaded.', req, res);
      return res.redirect('/');
    }

    OfferService.deleteOffer(offer, onSuccessCallback, onErrorCallback);
  },
  uploadImage: function (req, res) {

  }
}
