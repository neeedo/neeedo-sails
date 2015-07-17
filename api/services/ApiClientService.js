var apiClient = require('neeedo-api-nodejs-client')
    util = require('util'),
    IdValidator = require('../validators/Id'),
    TagsValidator = require('../validators/Tags'),
    DemandPriceValidator = require('../validators/DemandPrice'),
    LocationValidator = require('../validators/Location'),
    DistanceValidator = require('../validators/Distance'),
    ImageValidator = require('../validators/Image');

var Location = apiClient.models.Location,
    Error = apiClient.models.Error,
    Offer = apiClient.models.Offer,
    OfferList = apiClient.models.OfferList,
    OfferQuery = apiClient.models.OfferQuery,
    Demand = apiClient.models.Demand,
    Message = apiClient.models.Message,
    Favorite = apiClient.models.Favorite,
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

  validateAndCreateNewMessageIdFromRequest: function(req, res) {
    var validationResult = this.validateMessageIdFromRequest(req, res);

    if (!validationResult.success) {
      onErrorCallback(ApiClientService.newError("validateAndCreateNewMessageIdFromRequest: ", validationResult.message));
    }

    return validationResult.messageId;
  },

  validateMessageIdFromRequest: function(req, res) {
    var messageId = req.param("messageId");

    var idValidator = this.newIdValidator(res);

    if (undefined === messageId
      || !idValidator.isValid(messageId)) {

      return {
        success: false,
        message: idValidator.getErrorMessages(),
        messageId: messageId
      };
    }

    return {
      success: true,
      message: '',
      messageId: messageId
    };
  },

  validateAndCreateNewConversationFromRequest: function(req, res) {
    var validationResult = this.validateConversationFromRequest(req, res);

    if (!validationResult.success) {
      onErrorCallback(ApiClientService.newError("validateAndCreateNewConversationFromRequest: ", validationResult.message));
    }

    return new Conversation()
      .setSender(this.newUser().setId(validationResult.senderId))
      .setRecipient(LoginService.getCurrentUser(req));
  },

  validateConversationFromRequest: function(req, res) {
    var senderId = req.param("senderId");

    var idValidator = this.newIdValidator(res);

    if (undefined === senderId
      || !idValidator.isValid(senderId)) {

      return {
        success: false,
        message: idValidator.getErrorMessages(),
        senderId: senderId
      };
    }

    return {
      success: true,
      message: '',
      senderId: senderId
    };
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

  validateAndSetOfferFromRequest: function(req, res, offerModel, user, onErrorCallback) {
    var validationResult = this.validateOfferFromRequest(req, res);

    if (!validationResult.success) {
      onErrorCallback(ApiClientService.newError("validateAndSetOfferFromRequest: ", validationResult.message));
    } else {

        offerModel.setTags(validationResult.tags)
          .setLocation(validationResult.location)
          .setPrice(validationResult.price)
          .setUser(user)
          .setImageList(validationResult.images);
    }
  },

  validateImages : function(req) {
      return null === this.getImagesFromRequest(req)
            ||
           (null !== this.getImagesFromRequest(req)
           && 'length' in this.getImagesFromRequest(req)
           && this.getImagesFromRequest(req).length <= sails.config.webapp.images.maxCountPerObject);
  },

  validateOfferFromRequest: function(req, res) {
    if (!this.validateImages(req)) {
      return {
        success: false,
        message: 'You uploaded too many images.'
      }
    }

    var tags = this.newTagsFromRequest(req);
    var tagsValidator = this.newTagsValidator(
      res,
      sails.config.webapp.validations.offer.tags.minCount,
      sails.config.webapp.validations.offer.tags.maxCount
    );

    if (!tagsValidator.isValid(tags)) {
      return {
        success: false,
        message: tagsValidator.getErrorMessages()
      };
    }

    var price = this.newSimplePriceFromRequest(req);
    var priceValidator = this.newSimplePriceValidator(res);
    if (!priceValidator.isValid(price)) {
      return {
        success: false,
        message: priceValidator.getErrorMessages()
      };
    }

    var location = this.newLocationFromRequest(req);
    var locationValidator = this.newLocationValidator(res);
    if (!locationValidator.isValid(location)) {
      return {
        success: false,
        message: locationValidator.getErrorMessages()
      };
    }

    return {
      success: true,
      message: '',
      tags: tags,
      price: price,
      location: location,
      images: this.newImageListFromRequest(req)
    };
  },

  validateAndCreateNewDemandFromRequest: function(req, res, onErrorCallback) {
    var demandModel = new Demand();

    demandModel = this.validateAndSetDemandFromRequest(req, res, demandModel, LoginService.getCurrentUser(req), onErrorCallback);

    return demandModel;
  },

  validateAndSetDemandFromRequest: function(req, res, demandModel, user, onErrorCallback) {
    var validationResult = this.validateDemandFromRequest(req, res);

    if (!validationResult.success) {
      onErrorCallback(ApiClientService.newError("validateAndSetDemandFromRequest: ", validationResult.message));
      return undefined;
    } else {
      demandModel.setMustTags(validationResult.mustTags)
        .setShouldTags(validationResult.shouldTags)
        .setPrice(validationResult.price)
        .setUser(user)
        .setLocation(validationResult.location)
        .setDistance(validationResult.distance);
      return demandModel;
    }
  },

  validateDemandFromRequest: function(req, res) {
    // validate must tags
    var mustTags = this.newMustTagsFromRequest(req);
    var mustTagsValidator = this.newTagsValidator(
      res,
      sails.config.webapp.validations.demand.mustTags.minCount,
      sails.config.webapp.validations.demand.mustTags.maxCount
    );
    if (!mustTagsValidator.isValid(mustTags)) {
      return {
        success: false,
        message: mustTagsValidator.getErrorMessages()
      };
    }

    // validate should tags
    var shouldTags = this.newShouldTagsFromRequest(req);
    var shouldTagsValidator = this.newTagsValidator(
      res,
      sails.config.webapp.validations.demand.shouldTags.minCount,
      sails.config.webapp.validations.demand.shouldTags.maxCount
    );
    if (!shouldTagsValidator.isValid(shouldTags)) {
      return {
        success: false,
        message: shouldTagsValidator.getErrorMessages()
      };
    }

    // validate demand price
    var price = this.newDemandPriceFromRequest(req);
    var demandPriceValidator = this.newDemandPriceValidator(
      res,
      sails.config.webapp.validations.demand.price.minimum,
      sails.config.webapp.validations.demand.price.maximum
    );
    if (!demandPriceValidator.isValid(price)) {
      return {
        success: false,
        message: demandPriceValidator.getErrorMessages()
      };
    }

    // validate location
    var location = this.newLocationFromRequest(req);
    var locationValidator = this.newLocationValidator(res);
    if (!locationValidator.isValid(location)) {
      return {
        success: false,
        message: locationValidator.getErrorMessages()
      };
    }

    // validate distance
    var distance = this.newDistanceFromRequest(req);
    var distanceValidator = this.newDistanceValidator(res);
    if (!distanceValidator.isValid(distance)) {
      return {
        success: false,
        message: distanceValidator.getErrorMessages()
      };
    }

    return {
      success: true,
      message: '',
      mustTags: mustTags,
      shouldTags: shouldTags,
      price: price,
      location: location,
      distance: distance
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
  },

  validateAndCreateNewOfferIdFromRequest: function(req, res, onErrorCallback) {
    var validationResult = ApiClientService.validateOfferIdFromRequest(req, res);

    if (!validationResult.success) {
      onErrorCallback(ApiClientService.newError("validateAndCreateNewOfferIdFromRequest: ", validationResult.message));
      return undefined;
    } else {
      return validationResult.offerId;
    }
  },

  validateOfferIdFromRequest: function(req, res) {
    var offerId = req.param('offerId');

    var idValidator = this.newIdValidator(res);

    if (undefined === offerId
     || !idValidator.isValid(offerId)) {

      return {
        success: false,
        message: idValidator.getErrorMessages(),
        offerId: offerId
      };
    }

    return {
      success: true,
      message: '',
      offerId: offerId
    };
  },

  validateAndCreateNewDemandIdFromRequest: function(req, res, onErrorCallback) {
    var validationResult = ApiClientService.validateDemandIdFromRequest(req, res);

    if (!validationResult.success) {
      onErrorCallback(ApiClientService.newError("validateAndCreateNewDemandIdFromRequest: ", validationResult.message));
      return undefined;
    } else {
      return validationResult.demandId;
    }
  },

  validateDemandIdFromRequest: function(req, res) {
    var demandId = req.param('demandId');

    var idValidator = this.newIdValidator(res);

    if (undefined === demandId
     || !idValidator.isValid(demandId)) {

      return {
        success: false,
        message: idValidator.getErrorMessages(),
        demandId: demandId
      };
    }

    return {
      success: true,
      message: '',
      demandId: demandId
    };
  },

  validateAndCreateNewFavoriteFromRequest: function(req, onErrorCallback) {
    var validationResult = ApiClientService.validateFavoriteFromRequest(req);

    if (!validationResult.success) {
      onErrorCallback(ApiClientService.newError("validateAndCreateNewFavoriteFromRequest: ", validationResult.message));
    } else {
      return new Favorite()
        .setOffer(new Offer().setId(validationResult.offerId))
        .setUser(LoginService.getCurrentUser(req));
    }
  },

  validateFavoriteFromRequest: function(req) {
    var offerId = req.param('offerId');

    if (-1 !== offerId.indexOf("image")) {
      return {
        success: false,
        message: '',
        offerId: offerId
      };
    }

    return {
      success: true,
      message: '',
      offerId: offerId
    };
  },

  newIdValidator: function(res) {
    return new IdValidator(res.i18n);
  },

  newTagsValidator: function(res, minTagCount, maxTagCount) {
    return new TagsValidator(res.i18n, minTagCount, maxTagCount);
  },

  newDemandPriceValidator: function(res, minAllowedPrice, maxAllowedPrice) {
    return new DemandPriceValidator(res.i18n, minAllowedPrice, maxAllowedPrice);
  },

  newLocationValidator: function(res) {
    return new LocationValidator(res.i18n);
  },

  newDistanceValidator: function(res) {
    return new DistanceValidator(res.i18n);
  }
};
