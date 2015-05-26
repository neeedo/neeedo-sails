var util = require('util');

module.exports = {
  create: function (req, res) {
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
      var mustTags = req.param("mustTags");
      var shouldTags = req.param("shouldTags");
      var minPrice = req.param("minPrice");
      var maxPrice = req.param("maxPrice");
      var lat = req.param("lat");
      var lng = req.param("lng");
      var distance = req.param("distance");

      DemandService.createDemand(mustTags, shouldTags, lat, lng, distance, minPrice, maxPrice, LoginService.getCurrentUser(req), onSuccessCallback, onErrorCallback);
    } else {
      res.view('demand/create', {
        locals: {
          mustTags: "tag1, tag2,...",
          shouldTags: "tag1, tag2,...",
          minPrice: 0,
          maxPrice: 50,
          lat: 35.92516,
          lng: 12.37528,
          distance: 30,
          btnLabel: 'Create'
        }
      });
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

      res.redirect(DemandService.getEditUrl(updatedDemand));
    };

    var onErrorCallback = function(errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      res.redirect('/');
    };

    var onLoadSuccessCallback = function(loadedDemand) {
      sails.log.info("Demand " + util.inspect(loadedDemand, {
        showHidden: false,
        depth: null
      }) + " was loaded successfully.");

      if ("POST" == req.method) {
        var mustTags = req.param("mustTags");
        var shouldTags = req.param("shouldTags");
        var minPrice = req.param("minPrice");
        var maxPrice = req.param("maxPrice");
        var lat = req.param("lat");
        var lng = req.param("lng");
        var distance = req.param("distance");

        DemandService.updateDemand(loadedDemand, mustTags, shouldTags, lat, lng, distance, minPrice, maxPrice, onUpdateSuccessCallback, onErrorCallback);
      } else {
        if (undefined == loadedDemand) {
          FlashMessagesService.setErrorMessage('The demand could not be loaded.', req, res);
          return res.redirect('/');
        }

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

      res.redirect('/');
    };

    var onErrorCallback = function(errorModel) {
      ApiClientService.logMessages(errorModel);
      ApiClientService.addFlashMessages(req, res, errorModel);

      res.redirect('/');
    };

    var onLoadSuccessCallback = function(loadedDemand) {
      sails.log.info("Demand " + util.inspect(loadedDemand, {
        showHidden: false,
        depth: null
      }) + " was loaded successfully.");

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

      res.redirect('/');
    };

    var onLoadSuccessCallback = function(loadedDemand) {
      sails.log.info("Demand " + util.inspect(loadedDemand, {
        showHidden: false,
        depth: null
      }) + " was loaded successfully.");

      var limit = req.param("limit", PaginatorService.getDefaultLimit());
      var pageNumber = req.param("page", PaginatorService.getFirstPageNumber());
      var offset = PaginatorService.calculateOffset(limit, pageNumber);
      
      DemandService.matchOffers(loadedDemand, limit, offset, onMatchCallback, onErrorCallback);
    };

    var demandId = req.param("demandId");
    DemandService.loadDemand(req, demandId, onLoadSuccessCallback, onErrorCallback);
  }
}
