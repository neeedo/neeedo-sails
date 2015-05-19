var apiClient = require('neeedo-api-nodejs-client'),
    util = require('util');

var Demand = apiClient.models.Demand;
var Price = apiClient.models.DemandPrice;
var DemandService = apiClient.services.Demand;
var DemandListService = apiClient.services.DemandList;

module.exports = {
  /**
   * Load the currently logged in user's demands.
   * @param req
   * @param onSuccessCallback
   * @param onErrorCallback
   */
  loadUsersDemands: function(req, onSuccessCallback, onErrorCallback) {
    try {
      var demandListService = new DemandListService();
      demandListService.loadByUser(LoginService.getCurrentUser(req), onSuccessCallback, onErrorCallback);
    } catch (e) {
      onErrorCallback(ApiClientService.newError("loadUsersDemands:" + e.message, 'Your inputs were not valid.'));
    }
  },

  /**
   * Create a new demand. See neeedo API documentation for the meaning of the parameters.
   *
   * @see https://github.com/neeedo/neeedo-api#create-demand
   * @param mustTags
   * @param shouldTags
   * @param latitude
   * @param longitude
   * @param distance
   * @param minPrice
   * @param maxPrice
   * @param user
   * @param onSuccessCallback
   * @param onErrorCallBack
   */
  createDemand: function(mustTags, shouldTags, latitude, longitude, distance, minPrice, maxPrice, user, onSuccessCallback, onErrorCallBack) {
    try {
      var demandModel = new Demand();
      demandModel.setMustTags(ApiClientService.toTagArray(mustTags))
        .setShouldTags(ApiClientService.toTagArray(shouldTags))
        .setLocation(ApiClientService.newLocation(parseFloat(latitude), parseFloat(longitude)))
        .setPrice(new Price().setMin(parseFloat(minPrice)).setMax(parseFloat(maxPrice)))
        .setDistance(parseInt(distance))
        .setUser(user);

      sails.log.info('here');
      var demandService = new DemandService();
      demandService.createDemand(demandModel, onSuccessCallback, onErrorCallBack);
    } catch (e) {
      onErrorCallBack(ApiClientService.newError("createDemand:" + e.message, 'Your inputs were not valid.'));
    }
  },

  updateDemand: function(demandModel, mustTags, shouldTags, latitude, longitude, distance, minPrice, maxPrice, onSuccessCallback, onErrorCallBack) {
    try {
      demandModel.setMustTags(ApiClientService.toTagArray(mustTags))
        .setShouldTags(ApiClientService.toTagArray(shouldTags))
        .setLocation(ApiClientService.newLocation(parseFloat(latitude), parseFloat(longitude)))
        .setPrice(new Price().setMin(parseFloat(minPrice)).setMax(parseFloat(maxPrice)))
        .setDistance(parseInt(distance));

      var demandService = new DemandService();
      demandService.updateDemand(demandModel, onSuccessCallback, onErrorCallBack);
    } catch (e) {
      onErrorCallBack(ApiClientService.newError("updateDemand:" + e.message, 'Your inputs were not valid.'));
    }

  },

  deleteDemand: function(demandModel, onSuccessCallback, onErrorCallBack) {
    try {
      var demandService = new DemandService();
      demandService.deleteDemand(demandModel, onSuccessCallback, onErrorCallBack);
    } catch (e) {
      onErrorCallBack(ApiClientService.newError("deleteDemand:" + e.message, 'Your inputs were not valid.'));
    }

  },

  storeInSession: function(req, demandModel) {
    var demandId = demandModel.getId();

    if (! ("demands" in req.session)) {
      req.session.demands = {};
    }

    req.session.demands[demandId] = demandModel;
  },

  storeListInSession: function(req, demandListModel) {
    for (var i=0; i < demandListModel.getDemands().length; i++) {
      DemandService.storeInSession(req, demandListModel.getDemands()[i]);
    }
  },

   removeFromSession: function(req, demandModel) {
     var demandId = demandModel.getId();
     if (this.isInSession(req, demandModel.getId())) {
       req.session.demands[demandId] = undefined;
     }
   },

  loadDemand: function(req, demandId, onLoadCallback, onErrorCallback) {
    if (this.isInSession(req, demandId)) {
      try {
        sails.log.info('Attempt to restore demand with ID ' + demandId + " from session.");

        var demand = new Demand();
        demand.loadFromSerialized(req.session.demands[demandId])
          .setUser(LoginService.getCurrentUser(req));

        onLoadCallback(demand);
      } catch (e) {
        onErrorCallBack(ApiClientService.newError("loadDemand:" + e.message, 'Could not restore demand from session.'));
      }
    } else {
      // load via API
      sails.log.info('Attempt to load demand with ID ' + demandId + " via API.");

      var demandService = new DemandService();
      demandService.load(demandId, LoginService.getCurrentUser(req), onLoadCallback, onErrorCallback);
    }
  },

  isInSession: function(req, demandId) {
    return "demands" in req.session && demandId in req.session.demands && undefined != req.session.demands[demandId];
  },

  getEditUrl: function(demandModel) {
    return 'demands/edit/demandId/' + demandModel.getId();
  },

  getDeleteUrl: function(demandModel) {
    return 'demands/delete/demandId/' + demandModel.getId();
  }


};
