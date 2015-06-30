var apiClient = require('neeedo-api-nodejs-client')
    util = require('util'),
    ImageValidator = require('../validators/Image');

var Location = apiClient.models.Location,
    Error = apiClient.models.Error,
    Offer = apiClient.models.Offer,
    OfferList = apiClient.models.OfferList,
    OfferQuery = apiClient.models.OfferQuery,
    Demand = apiClient.models.Demand,
    Message = apiClient.models.Message,
    User = apiClient.models.User,
    DemandQuery = apiClient.models.DemandQuery,
    Register = apiClient.models.Register,
    Login = apiClient.models.Login,
    ImageService = apiClient.services.Image,
    MessageService = apiClient.services.Message,
    DemandPrice = apiClient.models.DemandPrice,
    Conversation= apiClient.models.Conversation,
    ConversationQuery = apiClient.models.ConversationQuery,
    ConversationList = apiClient.models.ConversationList
  ;

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
    var lat = req.param("lat", undefined);
    var lng = req.param("lng", undefined);

    if (undefined === lat || undefined === lng) {
      return undefined;
    } else if ('null' === lat || 'null' === lng) {
      // has to be sent by browser if no geolocation info is available
      return null;
    }

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

  getImagesFromRequest : function(req) {
    var param = req.param("images", null);

    return param;
  },

  newImageListFromRequest : function(req) {
    var imageList = imageService.newImageList();

    var images = this.getImagesFromRequest(req);

    if (null !== images) {
      for (var imageI=0; imageI < images.length; imageI++) {
        var fileName = images[imageI];

        var imageObj = imageService.newImage();
        imageObj.setFileName(fileName);
        imageList.addImage(imageObj);
      }
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

  newMessageBodyFromRequest : function(req) {
    return req.param("messageBody");
  },

  newRecipientIdFromRequest : function(req) {
    return req.param("recipientId");
  },

  newMessageIdFromRequest: function(req) {
    return req.param("messageId");
  },

  newConversationFromRequest: function(req) {
    var senderId = req.param("senderId");

    return new Conversation()
      .setSender(this.newUser().setId(senderId))
      .setRecipient(LoginService.getCurrentUser(req));
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
    var validationResult = this.validateRegisterFromRequest(req);

    if (!validationResult.success) {
      onErrorCallback(ApiClientService.newError("validateAndSetRegisterFromRequest: ", validationResult.message));
    }

    registerModel.setEMail( this.newEMailFromRequest(req) )
        .setUsername( this.newUsernameFromRequest(req) )
        .setPassword( this.newPasswordFromRequest(req) );
  },

  validateRegisterFromRequest: function(req) {
    // TODO implement
    return {
      success: true,
      message: ''
    };
  },

  validateAndCreateNewLoginFromRequest: function(req, onErrorCallback) {
    var loginModel = new Login();

    this.validateAndSetLoginFromRequest(req, loginModel, onErrorCallback);

    return loginModel;
  },

  validateAndSetLoginFromRequest: function(req, loginModel, onErrorCallback) {
    var validationResult = this.validateLoginFromRequest(req);

    if (!validationResult.success) {
      onErrorCallback(ApiClientService.newError("validateAndSetLoginFromRequest: ", validationResult.message));
    }

    loginModel.setEMail(this.newEMailFromRequest(req));
    loginModel.setPassword(this.newPasswordFromRequest(req));
  },

  validateLoginFromRequest: function(req) {
    // TODO implement
    return {
      success: true,
      message: ''
    };
  },

  validateAndCreateNewOfferFromRequest: function(req, onErrorCallback) {
    var offerModel = new Offer();

    this.validateAndSetOfferFromRequest(req, offerModel, LoginService.getCurrentUser(req), onErrorCallback);

    return offerModel;
  },

  validateAndSetOfferFromRequest: function(req, offerModel, user, onErrorCallback) {
    var validationResult = this.validateOfferFromRequest(req);

    if (!validationResult.success) {
      onErrorCallback(ApiClientService.newError("validateAndSetOfferFromRequest: ", validationResult.message));
    } else {

        offerModel.setTags(this.newTagsFromRequest(req))
          .setLocation(this.newLocationFromRequest(req))
          .setPrice(this.newSimplePriceFromRequest(req))
          .setUser(user)
          .setImageList(this.newImageListFromRequest(req));
    }
  },

  validateImages : function(req) {
      return null === this.getImagesFromRequest(req)
            ||
           (null !== this.getImagesFromRequest(req)
           && 'length' in this.getImagesFromRequest(req)
           && this.getImagesFromRequest(req).length <= sails.config.webapp.images.maxCountPerObject);
  },

  validateOfferFromRequest: function(req) {
    if (!this.validateImages(req)) {
      return {
        success: false,
        message: 'You uploaded too many images.'
      }
    }

    return {
      success: true,
      message: ''
    };
  },

  validateAndCreateNewDemandFromRequest: function(req, onErrorCallback) {
    var demandModel = new Demand();

    this.validateAndSetDemandFromRequest(req, demandModel, LoginService.getCurrentUser(req), onErrorCallback);

    return demandModel;
  },

  validateAndSetDemandFromRequest: function(req, demandModel, user, onErrorCallback) {
    var validationResult = this.validateDemandFromRequest(req);

    if (!validationResult.success) {
      onErrorCallback(ApiClientService.newError("validateAndSetDemandFromRequest: ", validationResult.message));
    } else {
      demandModel.setMustTags(this.newMustTagsFromRequest(req))
        .setShouldTags(this.newShouldTagsFromRequest(req))
        .setPrice(this.newDemandPriceFromRequest(req))
        .setUser(user)
        .setLocation(this.newLocationFromRequest(req))
        .setDistance(this.newDistanceFromRequest(req));
    }
  },

  validateDemandFromRequest: function(req) {
    // TODO implement
    return {
      success: true,
      message: ''
    };
  },

  validateAndCreateNewMessageFromRequest: function(req, onErrorCallback) {
    var messageModel = new Message();

    this.validateAndSetMessageFromRequest(req, messageModel, LoginService.getCurrentUser(req), onErrorCallback);

    return messageModel;
  },

  validateAndSetMessageFromRequest: function(req, messageModel, sender, onErrorCallback) {
    var validationResult = this.validateMessageFromRequest(req);

    if (!validationResult.success) {
      onErrorCallback(ApiClientService.newError("validateAndSetMessageFromRequest: ", validationResult.message));
    } else {
      messageModel.setBody(this.newMessageBodyFromRequest(req))
        .setSender(sender);
      messageModel.getRecipient().setId(this.newRecipientIdFromRequest(req));
    }
  },

  validateMessageFromRequest: function(req) {
    // TODO implement
    return {
      success: true,
      message: ''
    };
  },

  setPaginationParameter: function(req, queryModel) {
    // pagination
    var limit = parseInt(req.param("limit", PaginatorService.getDefaultLimit()));
    var pageNumber = parseInt(req.param("page", PaginatorService.getFirstPageNumber()));
    var offset = PaginatorService.calculateOffset(limit, pageNumber);

    queryModel
      .setLimit(limit)
      .setOffset(offset);
  },

  setLocationParameterIfGiven: function(req, queryModel) {
    var location = this.buildUsersCurrentLocationObject(req);

    if (undefined !== location) {
       queryModel
         .setLatitude(location.getLatitude())
         .setLongitude(location.getLongitude());
    }
  },

  /**
   * Build most-recent demand query object to be handed to neeedo-api-nodejs-client Demand Service.
   *
   * - Trigger logic to fill latLng values from request if given (otherwise fallback to default locations).
   * - Set distance.
   *
   * @param req
   */
  newDemandQueryFromRequest: function(req) {
    var queryModel = new DemandQuery();

    this.setPaginationParameter(req, queryModel);
    this.setLocationParameterIfGiven(req, queryModel);

    return queryModel;
  },

  /**
   * Build most-recent offer query object to be handed to neeedo-api-nodejs-client Demand Service.
   *
   * - Trigger logic to fill latLng values from request if given (otherwise fallback to default locations).
   *
   * @param req
   */
  newOfferQueryFromRequest: function(req) {
    var queryModel = new OfferQuery();

    this.setPaginationParameter(req, queryModel);
    this.setLocationParameterIfGiven(req, queryModel);

    return queryModel;
  },

  buildUsersCurrentLocationObject: function(req) {
    var requestLocation = this.newLocationFromRequest(req);

    if (undefined === requestLocation) {
      // no parameter given, so do not build any location object
       return undefined;
    }

    if (null === requestLocation) {
      // parameter did not contain latLng values, e.g. because the client could not determine -> get default location
      var defaultLocaleLocation = new Location();

      defaultLocaleLocation
        .setLatitude(LocaleService.getDefaultLatitude(req))
        .setLongitude(LocaleService.getDefaultLongitude(req));

      return defaultLocaleLocation;
    }

    return requestLocation;
  },

  newDemand: function() {
    return new Demand();

  },

  newOffer: function() {
    return new Offer();
  },

  newUser: function() {
    return new User();
  },

  newConversationList: function() {
    return new ConversationList();
  },

  newConversationQueryForReadConversations: function() {
    return new ConversationQuery().setReadFlag(true);
  },

  newConversationQueryForUnreadConversations: function() {
    return new ConversationQuery().setReadFlag(false);
  },

  newMessage: function() {
    return new Message();
  },

  newOfferList: function() {
    return new OfferList();
  }
};
