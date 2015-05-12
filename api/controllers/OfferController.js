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

      FlashMessagesService.setSuccessMessage('Your offer was created successfully', req, res);

      res.view('offer/create', {

      });
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
  update: function (req, res) {

  },
  delete: function (req, res) {

  },
  uploadImage: function (req, res) {

  }
}
