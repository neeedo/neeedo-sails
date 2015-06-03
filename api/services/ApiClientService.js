var apiClient = require('neeedo-api-nodejs-client')
    util = require('util');

var Location = apiClient.models.Location,
    Error = apiClient.models.Error,
    Offer = apiClient.models.Offer,
    Demand = apiClient.models.Demand,
    Register = apiClient.models.Register,
    Login = apiClient.models.Login,
    ImageService = apiClient.services.Image,
    DemandPrice = apiClient.models.DemandPrice;

var imageService = new ImageService();

module.exports = {
  client: apiClient,

  logMessages : function(errorModel) {
    for (var i = 0; i < errorModel.getLogMessages().length; i++) {
      sails.log.error(errorModel.getLogMessages()[i]);
    }
  },

  addFlashMessages : function(req, res, errorModel) {
    for (var i = 0; i < errorModel.getErrorMessages().length; i++) {
      FlashMessagesService.setErrorMessage(errorModel.getErrorMessages()[i], req, res);
    }
  },

  newLocation : function(lat, lng) {
    return new Location().setLatitude(lat).setLongitude(lng);
  },

  newLocationFromRequest : function(req) {
    var lat = req.param("lat");
    var lng = req.param("lng");

    return this.newLocation(parseFloat(lat), parseFloat(lng));
  },

  newDemandPrice : function(min, max) {
    return new DemandPrice().setMin(min).setMax(max);
  },

  newDemandPriceFromRequest : function(req) {
    var minPrice = req.param("minPrice");
    var maxPrice = req.param("maxPrice");

    return this.newDemandPrice(parseFloat(minPrice), parseFloat(maxPrice));
  },

  newSimplePriceFromRequest : function(req) {
    var price = req.param("price");

    return parseFloat(price);
  },

  newImageListFromRequest : function(req) {
    var imagesStr = req.param("images");
    var fileNames = imagesStr.split(/\s*,\s*/);

    var imageList = imageService.newImageList();
    for (var fileName in fileNames) {
      var imageObj = imageService.newImage();
      imageObj.setFileName(fileName);
      imageList.addImage(imageObj);
    }

    return imageList;
  },

  toTagArray : function(tagStr) {
    // split by being "whitespace-friendly" (e.g. allow 'value1 , value2')
    return tagStr.split(/\s*,\s*/);
  },

  newTagsFromRequest : function(req) {
    var tags = req.param("tags");

    return this.toTagArray(tags);
  },

  newShouldTagsFromRequest : function(req) {
    var shouldTags = req.param("shouldTags");

    return this.toTagArray(shouldTags);
  },

  newMustTagsFromRequest : function(req) {
    var mustTags = req.param("mustTags");

    return this.toTagArray(mustTags);
  },

  newDistanceFromRequest : function(req) {
    var distance = req.param("distance");

    return parseFloat(distance);
  },

  newUsernameFromRequest : function(req) {
    return req.param("username");
  },

  newEMailFromRequest : function(req) {
    return req.param("email");
  },

  newPasswordFromRequest : function(req) {
    return req.param("password");
  },

  toTagString : function(tagArray) {
    return tagArray.join();
  },

  newError: function(messageForLog, messageForUser) {
   return new Error().addLogMessage(messageForLog).addErrorMessage(messageForUser);
  },

  validateAndCreateNewRegisterFromRequest: function(req, onErrorCallback) {
    var registerModel = new Register();

    this.validateAndSetRegisterFromRequest(req, registerModel, onErrorCallback);

    return registerModel;
  },

  validateAndSetRegisterFromRequest: function(req, registerModel, onErrorCallback) {
    if (!this.validateRegisterFromRequest(req)) {
      onErrorCallback(ApiClientService.newError("validateAndSetRegisterFromRequest: ", 'Your inputs were not valid.'));
    }

    registerModel.setEMail( this.newEMailFromRequest(req) )
        .setUsername( this.newUsernameFromRequest(req) )
        .setPassword( this.newPasswordFromRequest(req) );
  },

  validateRegisterFromRequest: function(req) {
    // TODO implement
    return true;
  },

  validateAndCreateNewLoginFromRequest: function(req, onErrorCallback) {
    var loginModel = new Login();

    this.validateAndSetLoginFromRequest(req, loginModel, onErrorCallback);

    return loginModel;
  },

  validateAndSetLoginFromRequest: function(req, loginModel, onErrorCallback) {
    if (!this.validateLoginFromRequest(req)) {
      onErrorCallback(ApiClientService.newError("validateAndSetLoginFromRequest: ", 'Your inputs were not valid.'));
    }

    loginModel.setEMail(this.newEMailFromRequest(req));
    loginModel.setPassword(this.newPasswordFromRequest(req));
  },

  validateLoginFromRequest: function(req) {
    // TODO implement
    return true;
  },

  validateAndCreateNewOfferFromRequest: function(req, onErrorCallback) {
    var offerModel = new Offer();

    this.validateAndSetOfferFromRequest(req, offerModel, LoginService.getCurrentUser(req), onErrorCallback);

    return offerModel;
  },

  validateAndSetOfferFromRequest: function(req, offerModel, user, onErrorCallback) {
    if (!this.validateOfferFromRequest(req)) {
      onErrorCallback(ApiClientService.newError("validateAndSetOfferFromRequest: ", 'Your inputs were not valid.'));
    }

    offerModel.setTags(this.newTagsFromRequest(req))
      .setLocation(this.newLocationFromRequest(req))
      .setPrice(this.newSimplePriceFromRequest(req))
      .setUser(user)
      .setImageList(this.newImageListFromRequest(req));
  },

  validateOfferFromRequest: function(req) {
    // TODO implement
    return true;
  },

  validateAndCreateNewDemandFromRequest: function(req, onErrorCallback) {
    var demandModel = new Demand();

    this.validateAndSetDemandFromRequest(req, demandModel, LoginService.getCurrentUser(req), onErrorCallback);

    return demandModel;
  },

  validateAndSetDemandFromRequest: function(req, demandModel, user, onErrorCallback) {
    if (!this.validateDemandFromRequest(req)) {
      onErrorCallback(ApiClientService.newError("validateAndSetDemandFromRequest:", 'Your inputs were not valid.'));
    }

    demandModel.setMustTags(this.newMustTagsFromRequest(req))
      .setShouldTags(this.newShouldTagsFromRequest(req))
      .setPrice(this.newDemandPriceFromRequest(req))
      .setUser(user)
      .setLocation(this.newLocationFromRequest(req))
      .setDistance(this.newDistanceFromRequest(req));
  },

  validateDemandFromRequest: function(req) {
    // TODO implement
    return true;
  },

  getImageUploadUrl : function() {
    return imageService.getBaseUrl();
  }
};
