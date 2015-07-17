var apiClient = require('neeedo-api-nodejs-client'),
  util = require('util');

var Demand = apiClient.models.Demand;
var DemandList = apiClient.models.DemandList;
var ClientDemandService = apiClient.services.Demand;
var DemandListService = apiClient.services.DemandList;
var MatchingService = apiClient.services.Matching;

module.exports = {
  newDemandListService: function () {
    return new DemandListService();
  },

  /**
   * Load the currently logged in user's demands.
   * @param req
   * @param onSuccessCallback
   * @param onErrorCallback
   */
  loadUsersDemands: function (req, res, onSuccessCallback, onErrorCallback) {
    try {
      var demandListService = this.newDemandListService();
      var demandQuery = ApiClientService.newDemandQueryFromRequest(req, res);

      demandListService.loadByUser(LoginService.getCurrentUser(req), demandQuery, onSuccessCallback, onErrorCallback);
    } catch (e) {
      onErrorCallback(ApiClientService.newError("loadUsersDemands:" + e.message, 'Your inputs were not valid.'));
    }
  },

  /**
   * Load the most recent demands.
   * @param req
   * @param onSuccessCallback
   * @param onErrorCallback
   */
  loadMostRecentDemands: function (req, res, onSuccessCallback, onErrorCallback) {
    try {
      var demandQuery = ApiClientService.newDemandQueryFromRequest(req, res);
      var demandListService = this.newDemandListService();

      demandListService.loadMostRecent(demandQuery, onSuccessCallback, onErrorCallback);
    } catch (e) {
      onErrorCallback(ApiClientService.newError("loadMostRecentDemands:" + e.message, "The demands couldn't be loaded. Please contact Neeedo customer care."));
    }
  },

  /**
   * Create a new demand. See neeedo API documentation for the meaning of the parameters.
   *
   * @see https://github.com/neeedo/neeedo-api#create-demand
   * @param req
   * @param onSuccessCallback
   * @param onErrorCallBack
   */
  createDemand: function (req, res, onSuccessCallback, onErrorCallBack) {
    try {
      var demandModel = ApiClientService.validateAndCreateNewDemandFromRequest(req, res, onErrorCallBack);

      if (undefined !== demandModel) {
        var demandService = this.newClientDemandService();
        demandService.createDemand(demandModel, onSuccessCallback, onErrorCallBack);
      }
    } catch (e) {
      onErrorCallBack(ApiClientService.newError("createDemand:" + e.message, 'Your inputs were not valid.'));
    }
  },

  newDemand: function () {
    return new Demand();
  },

  newClientDemandService: function () {
    return new ClientDemandService();
  },

  loadAndUpdateDemand: function (req, res, onUpdateSuccessCallback, onErrorCallback) {
    var showFormWithDemandValues = function (loadedDemand) {
      res.view('demand/edit', {
        locals: {
          mustTags: ApiClientService.toTagString(loadedDemand.getMustTags()),
          shouldTags: ApiClientService.toTagString(loadedDemand.getShouldTags()),
          minPrice: loadedDemand.getPrice().getMin(),
          maxPrice: loadedDemand.getPrice().getMax(),
          lat: loadedDemand.getLocation().getLatitude(),
          lng: loadedDemand.getLocation().getLongitude(),
          distance: loadedDemand.getDistance(),
          btnLabel: 'Edit and find matching offers',
          validationMessages: []
        }
      });
    };

    var onLoadSuccessCallback = function (loadedDemand) {
      if (!DemandService.setBelongsToCurrentUser(req, res, loadedDemand)) {
        return res.redirect(DemandService.getOverviewUrl());
      }

      if ("POST" == req.method) {
        DemandService.updateDemand(loadedDemand, req, res, onUpdateSuccessCallback, onErrorCallback);
      } else {
        if (undefined == loadedDemand) {
          FlashMessagesService.setErrorMessage('The demand could not be loaded.', req, res);
          return res.redirect(DemandService.getOverviewUrl());
        }

        showFormWithDemandValues(loadedDemand);
      }

    };

    this.loadDemand(req, res, onLoadSuccessCallback, onErrorCallback);
  },

  updateDemand: function (demandModel, req, res, onSuccessCallback, onErrorCallBack) {
    try {
      demandModel = ApiClientService.validateAndSetDemandFromRequest(req, res, demandModel, demandModel.getUser(), onErrorCallBack);

      if (undefined !== demandModel) {
        var demandService = this.newClientDemandService();
        demandService.updateDemand(demandModel, onSuccessCallback, onErrorCallBack);
      }
    } catch (e) {
      onErrorCallBack(ApiClientService.newError("updateDemand:" + e.message, 'Your inputs were not valid.'));
    }
  },

  loadAndDeleteDemand: function (req, res, onDeleteSuccessCallback, onErrorCallback) {
    var onLoadSuccessCallback = function (loadedDemand) {
      if (!DemandService.setBelongsToCurrentUser(req, res, loadedDemand)) {
        return res.redirect(DemandService.getOverviewUrl());
      }

      DemandService.deleteDemand(loadedDemand, onDeleteSuccessCallback, onErrorCallback);
    };

    this.loadDemand(req, res, onLoadSuccessCallback, onErrorCallback);
  },

  deleteDemand: function (demandModel, onSuccessCallback, onErrorCallBack) {
    try {
      var demandService = new ClientDemandService();
      demandService.deleteDemand(demandModel, onSuccessCallback, onErrorCallBack);
    } catch (e) {
      onErrorCallBack(ApiClientService.newError("deleteDemand:" + e.message, 'Your inputs were not valid.'));
    }
  },

  loadAndMatchOffers: function (req, res, onMatchCallback, onErrorCallback) {
    var onLoadSuccessCallback = function (loadedDemand) {
      if (!DemandService.setBelongsToCurrentUser(req, res, loadedDemand)) {
        return res.redirect(DemandService.getOverviewUrl());
      }

      DemandService.matchOffers(loadedDemand, req, res, onMatchCallback, onErrorCallback);
    };

    this.loadDemand(req, res, onLoadSuccessCallback, onErrorCallback);
  },

  matchOffers: function (demandModel, req, res, onSuccessCallback, onErrorCallback) {
    try {
      var demandQuery = ApiClientService.newDemandQueryFromRequest(req, res);

      var matchingService = new MatchingService();
      matchingService.matchDemand(demandModel, demandQuery, onSuccessCallback, onErrorCallback);
    } catch (e) {
      onErrorCallback(ApiClientService.newError("matchOffers:" + e.message, 'Your inputs were not valid.'));
    }
  },

  storeInSession: function (req, demandModel) {
    var demandId = demandModel.getId();

    if (!("demands" in req.session)) {
      req.session.demands = {};
    }

    req.session.demands[demandId] = demandModel;
  },

  storeListInSession: function (req, demandListModel) {
    for (var i = 0; i < demandListModel.getDemands().length; i++) {
      DemandService.storeInSession(req, demandListModel.getDemands()[i]);
    }
  },

  removeFromSession: function (req, demandModel) {
    var demandId = demandModel.getId();
    if (this.isInSession(req, demandModel.getId())) {
      req.session.demands[demandId] = undefined;
    }
  },

  loadDemand: function (req, res, onLoadCallback, onErrorCallback) {
    var demandId = ApiClientService.validateAndCreateNewDemandIdFromRequest(req, res, onErrorCallback);

    if (undefined !== demandId) {
      if (this.isInSession(req, demandId)) {
        try {
          sails.log.info('Attempt to restore demand with ID ' + demandId + " from session.");

          var demand = new Demand();
          demand.loadFromSerialized(req.session.demands[demandId]);

          onLoadCallback(demand);
        } catch (e) {
          onErrorCallBack(ApiClientService.newError("loadDemand:" + e.message, 'Could not restore demand from session.'));
        }
      } else {
        // load via API
        sails.log.info('Attempt to load demand with ID ' + demandId + " via API.");

        var demandService = new ClientDemandService();
        demandService.load(demandId, LoginService.getCurrentUser(req), onLoadCallback, onErrorCallback);
      }
    }
  },

  isInSession: function (req, demandId) {
    return "demands" in req.session && demandId in req.session.demands && undefined != req.session.demands[demandId];
  },

  getCreateUrl: function() {
    return UrlService.to('/demands/create');
  },

  getViewUrl: function () {
    return UrlService.to('/demands/view/demandId/%%demandId%%');
  },

  getEditUrl: function (demandModel) {
    if (undefined == demandModel.getId()) {
      return '/';
    }

    return UrlService.to('/demands/edit/demandId/' + demandModel.getId());
  },

  getMatchingUrl: function (demandModel) {
    if (undefined == demandModel.getId()) {
      return '/';
    }

    return UrlService.to('/matching/demandId/' + demandModel.getId());
  },

  getAjaxMatchingUrl: function (demandModel) {
    if (undefined == demandModel.getId()) {
      return '/';
    }

    return UrlService.to('/ajax-matching/demandId/' + demandModel.getId());
  },

  getDeleteUrl: function (demandModel) {
    if (undefined == demandModel.getId()) {
      return '/';
    }

    return UrlService.to('/demands/delete/demandId/' + demandModel.getId());
  },

  getOverviewUrl: function (demandModel) {
    return UrlService.to('/dashboard');
  },

  getDemandsGetUrl: function () {
    return UrlService.to('/demands/ajax-get');
  },

  getUsersDemandsGetUrl: function () {
    return UrlService.to('/user/ajax-get-demands');
  },


  belongsToCurrentUser: function (req, demand) {
    return LoginService.userIsLoggedIn(req)
      && undefined !== demand.getUser()
      && LoginService.getCurrentUser(req).getId() == demand.getUser().getId();
  },

  setBelongsToCurrentUser: function (req, res, demand) {
    if (this.belongsToCurrentUser(req, demand)) {
      demand.setUser(LoginService.getCurrentUser(req));
      return true;
    } else {
      FlashMessagesService.setErrorMessage('You cannot edit demands of other users.', req, res);
      return false;
    }
  },

  sendDemandListJsonResponse: function (req, res, demandList) {
    res.status(200);

    this.appendHtmlIfDesired(demandList, req, res, function () {
      res.json({
        demandList: demandList
      });
    });
  },

  /**
   * Iterate over each demand in the given list and append the rendered HTML to the field 'html'.
   *
   * Use the partial demandsForList.js which are used in the sliders.
   *
   * @param demandList
   * @param req
   * @param res
   * @param callback
   */
  appendHtmlIfDesired: function (demandList, req, res, callback) {
    // check if getHtml parameter is given in request
    var getHtml = req.param('getHtml', undefined);

    if (getHtml && demandList.getDemands().length > 0) {
      var counter = 0;

      _.each(demandList.getDemands(), function (demand) {
            ViewService.renderView(
              "partials/demandsForList",
              {
                demand: demand,
                req: req,
                i18n: res.i18n
              },
              function (html) {
                counter++;

                demand.html = html;

                if (counter == demandList.getDemands().length) {
                  // all demands were appended by rendered partial
                  callback();
                }
              })
        }
      );
    } else {
      // do not append
      callback();
    }
  },

  /**
   * Send JSON error response.
   *
   * @param res
   * @param errorModel , see neeedo-api-nodejs-client
   */
  sendErrorJsonResponse: function (res, errorModel) {
    sails.log.error('OfferService:sendErrorJsonResponse(): ' + errorModel.getLogMessages()[0]);

    res.status(400);

    res.json({
      message: errorModel.getErrorMessages()[0]
    });
  },

  displayValidationMessages: function(req, res, errorModel) {
    var viewParameters = {
      validationMessages: errorModel.getValidationMessages(),
      btnLabel: 'Create'
    };

    for (var paramKey in errorModel.getOriginalParameters()) {
      var paramValue = errorModel.getOriginalParameters()[paramKey];

      viewParameters[paramKey] = paramValue;
    };


    res.view('demand/create', {
      locals: viewParameters
    });
  }
};
