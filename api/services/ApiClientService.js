var apiClient = require('neeedo-api-nodejs-client')
    util = require('util'),
    _ = require('underscore')
;

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
  Conversation = apiClient.models.Conversation,
  ConversationQuery = apiClient.models.ConversationQuery,
  ConversationList = apiClient.models.ConversationList
  ;

var imageService = new ImageService();

module.exports = {
  client: apiClient,

  /**
   * ########################################
   * #
   * # Request parameter handling
   * #
   * ########################################
   */
  PARAM_TAGS_KEY: "tags",
  PARAM_SIMPLE_PRICE_KEY: "price",
  PARAM_LATITUDE_KEY: "lat",
  PARAM_LONGITUDE_KEY: "lng",
  PARAM_IMAGES_KEY: "images",
  PARAM_MUST_TAGS_KEY: "mustTags",
  PARAM_SHOULD_TAGS_KEY: "shouldTags",
  PARAM_MIN_PRICE_KEY: "minPrice",
  PARAM_MAX_PRICE_KEY: "maxPrice",
  PARAM_DISTANCE_KEY: "distance",
  PARAM_USERNAME_KEY: "username",
  PARAM_EMAIL_KEY: "email",
  PARAM_PASSWORD_KEY: "password",
  PARAM_MESSAGE_BODY_KEY: "messageBody",
  PARAM_RECIPIENT_ID_KEY: "recipientId",
  PARAM_OFFER_ID_KEY: "offerId",
  PARAM_DEMAND_ID_KEY: "demandId",

  getTagsFromRequest: function (req) {
    return req.param(this.PARAM_TAGS_KEY);
  },

  getSimplePriceFromRequest: function (req) {
    return req.param(this.PARAM_SIMPLE_PRICE_KEY);
  },

  getLatitudeFromRequest: function (req) {
    return req.param(this.PARAM_LATITUDE_KEY);
  },

  getLongitudeFromRequest: function (req) {
    return req.param(this.PARAM_LONGITUDE_KEY);
  },

  getMustTagsFromRequest: function (req) {
    return req.param(this.PARAM_MUST_TAGS_KEY);
  },

  getShouldTagsFromRequest: function (req) {
    return req.param(this.PARAM_SHOULD_TAGS_KEY);
  },

  getMinPriceFromRequest: function (req) {
    return req.param(this.PARAM_MIN_PRICE_KEY);
  },

  getMaxPriceFromRequest: function (req) {
    return req.param(this.PARAM_MAX_PRICE_KEY);
  },

  getDistanceFromRequest: function (req) {
    return req.param(this.PARAM_DISTANCE_KEY);
  },

  getImagesFromRequest: function (req) {
    return req.param(this.PARAM_IMAGES_KEY);
  },

  getUsernameRequest: function (req) {
    return req.param(this.PARAM_USERNAME_KEY);
  },

  getEMailFromRequest: function (req) {
    return req.param(this.PARAM_EMAIL_KEY);
  },

  getPasswordFromRequest: function (req) {
    return req.param(this.PARAM_PASSWORD_KEY);
  },

  getMessageBodyFromRequest: function (req) {
    return req.param(this.PARAM_MESSAGE_BODY_KEY);
  },

  getRecipientIdFromRequest: function (req) {
    return req.param(this.PARAM_RECIPIENT_ID_KEY);
  },

  getOfferIdFromRequest: function (req) {
    return req.param(this.PARAM_OFFER_ID_KEY);
  },

  getDemandIdFromRequest: function (req) {
    return req.param(this.PARAM_DEMAND_ID_KEY);
  },

  newTagListFromParam: function (tags) {
    return this.toTagArray(tags);
  },

  newSimplePriceFromParam: function (simplePrice) {
    return parseFloat(simplePrice);
  },

  newLocationFromParam: function (latitude, longitude) {
    return this.newLocation(parseFloat(latitude), parseFloat(longitude));
  },

  newImageListFromParam: function (images) {
    return this.newImageList(images);
  },

  newDemandPriceFromParam: function (minPrice, maxPrice) {
    return this.newDemandPrice(parseFloat(minPrice), parseFloat(maxPrice));
  },

  newDistanceFromParam: function (distance) {
    return parseFloat(distance);
  },

  logMessages: function (errorModel) {
    if (_.isFunction(errorModel.getLogMessages)) {
      for (var i = 0; i < errorModel.getLogMessages().length; i++) {
        sails.log.error(errorModel.getLogMessages()[i]);
      }
    }
  },

  addFlashMessages: function (req, res, errorModel) {
    if (_.isFunction(errorModel.getErrorMessages)) {
      for (var i = 0; i < errorModel.getErrorMessages().length; i++) {
        FlashMessagesService.setErrorMessage(errorModel.getErrorMessages()[i], req, res);
      }
    }
  },

  addFlashMessagesForValidationMessages: function (req, res, errorModel) {
    if (_.isFunction(errorModel.hasValidationMessages)) {
      if (errorModel.hasValidationMessages()) {
        for (var validationKey in errorModel.getValidationMessages()) {
          FlashMessagesService.setErrorMessage(validationKey + ": " + errorModel.getValidationMessages()[validationKey], req, res);
        }
      }
    }
  },

  /**
   * ########################################
   * #
   * # API Client object factory methods
   * #
   * ########################################
   */
  newLocation: function (lat, lng) {
    return new Location().setLatitude(lat).setLongitude(lng);
  },

  newDemandPrice: function (min, max) {
    return new DemandPrice().setMin(min).setMax(max);
  },

  newImageList: function (images) {
    var imageList = imageService.newImageList();

    if (undefined !== images) {
      for (var imageI = 0; imageI < images.length; imageI++) {
          var fileName = images[imageI];

          var imageObj = imageService.newImage();
          imageObj.setFileName(fileName);
          imageList.addImage(imageObj);
      }
    }

    return imageList;
  },

  toTagArray: function (tagStr) {
    // split by being "whitespace-friendly" (e.g. allow 'value1 , value2')
    return tagStr.split(/\s*,\s*/);
  },

  newUsernameFromRequest: function (req) {
    return req.param("username");
  },

  newEMailFromRequest: function (req) {
    return req.param("email");
  },

  newPasswordFromRequest: function (req) {
    return req.param("password");
  },

  newMessageBodyFromRequest: function (req) {
    return req.param("messageBody");
  },

  newRecipientIdFromRequest: function (req) {
    return req.param("recipientId");
  },

  newDemand: function () {
    return new Demand();
  },

  newOffer: function () {
    return new Offer();
  },

  newUser: function () {
    return new User();
  },

  newConversationList: function () {
    return new ConversationList();
  },

  newConversationQueryForReadConversations: function () {
    return new ConversationQuery().setReadFlag(true);
  },

  newConversationQueryForUnreadConversations: function () {
    return new ConversationQuery().setReadFlag(false);
  },

  newMessage: function () {
    return new Message();
  },

  newOfferList: function () {
    return new OfferList();
  },

  validateAndCreateNewMessageIdFromRequest: function (req, res) {
    var validationResult = this.validateMessageIdFromRequest(req, res);

    if (!validationResult.success) {
      onErrorCallback(ApiClientService.newError("validateAndCreateNewMessageIdFromRequest: ", validationResult.message));
    }

    return validationResult.messageId;
  },

  validateMessageIdFromRequest: function (req, res) {
    var messageId = req.param("messageId");

    var idValidator = ValidationService.newIdValidator(res.i18n);

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

  validateAndCreateNewConversationFromRequest: function (req, res, onErrorCallback) {
    var validationResult = this.validateConversationFromRequest(req, res);

    if (!validationResult.success) {
      onErrorCallback(ApiClientService.newError("validateAndCreateNewConversationFromRequest: ", validationResult.message));
      return undefined;
    }

    return new Conversation()
      .setSender(this.newUser().setId(validationResult.senderId))
      .setRecipient(LoginService.getCurrentUser(req));
  },

  validateConversationFromRequest: function (req, res) {
    var senderId = req.param("senderId");

    var idValidator = ValidationService.newIdValidator(res.i18n);

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

  toTagString: function (tagArray) {
    return tagArray.join();
  },

  /**
   * Create a new api client error object.
   * *
   * @param messageForLog
   * @param messageForUser string | array of string
   * @returns {*}
   */
  newError: function (messageForLog, messageForUser) {
    var error = new Error().addLogMessage(messageForLog);

    if (_.isArray(messageForUser)) {
      for (var i = 0; i < messageForUser.length; i++) {
        error.addErrorMessage(messageForUser[i]);
      }
    } else {
      error.addErrorMessage(messageForUser);
    }

    return error;
  },

  newValidationError: function (validationErrors, givenParams) {
    return new Error().setValidationMessages(validationErrors)
      .setOriginalParameters(givenParams)
      ;
  },

  validateAndCreateNewRegisterFromRequest: function (req, res, onErrorCallback) {
    var registerModel = new Register();

    registerModel = this.validateAndSetRegisterFromRequest(req, res, registerModel, onErrorCallback);

    return registerModel;
  },

  validateAndSetRegisterFromRequest: function (req, res, registerModel, onErrorCallback) {
    var validationResult = this.validateRegisterFromRequest(req, res);

    if (!validationResult.success) {
      onErrorCallback(ApiClientService.newValidationError(validationResult.validationErrors, validationResult.params));
      return undefined;
    } else {
      return this.processRegisterModelFromRequest(registerModel, validationResult.params);
    }
  },

  validateRegisterFromRequest: function (req, res) {
    var userValidator = ValidationService.newUserValidator(res.i18n);

    var username = this.getUsernameRequest(req),
      eMail = this.getEMailFromRequest(req),
      password = this.getPasswordFromRequest(req);

    if (!userValidator.isValid(username, eMail, password)) {
      return {
        success: false,
        validationErrors: userValidator.getErrorMessages(),
        params: {
          username: username,
          email: eMail,
          password: password
        }
      };
    }

    return {
      success: true,
      params: {
        username: username,
        email: eMail,
        password: password
      }
    };
  },

  /**
   * Fill the offer model by the given params.
   *
   * @param registerModel
   * @param user
   * @param params
   * @returns {*}
   */
  processRegisterModelFromRequest: function(registerModel, params) {
    return registerModel.setEMail(params.email)
      .setUsername(params.username)
      .setPassword(params.password);
  },

  validateAndCreateNewLoginFromRequest: function (req, res, onErrorCallback) {
    var loginModel = new Login();

    loginModel = this.validateAndSetLoginFromRequest(req, res, loginModel, onErrorCallback);

    return loginModel;
  },

  validateAndSetLoginFromRequest: function (req, res, loginModel, onErrorCallback) {
    var validationResult = this.validateLoginFromRequest(req, res);

    if (!validationResult.success) {
      onErrorCallback(ApiClientService.newValidationError(validationResult.validationErrors, validationResult.params));
      return undefined;
    } else {
      return this.processLoginModelFromRequest(loginModel, validationResult.params);
    }
  },

  validateLoginFromRequest: function (req, res) {
    var loginValidator = ValidationService.newLoginValidator(res.i18n);

    var eMail = this.getEMailFromRequest(req),
      password = this.getPasswordFromRequest(req);

    if (!loginValidator.isValid(eMail, password)) {
      return {
        success: false,
        validationErrors: loginValidator.getErrorMessages(),
        params: {
          email: eMail,
          password: password
        }
      };
    }

    return {
      success: true,
      params: {
        email: eMail,
        password: password
      }
    };
  },

  processLoginModelFromRequest: function(loginModel, params) {
    loginModel.setEMail(params.email);
    loginModel.setPassword(params.password);

    return loginModel;
  },

  /**
   * Create a new offer, validate the request parameter values, fill the model on success.
   * Otherwise, call onErrorCallback with validation errors set in the given error model.
   *
   * @param req
   * @param res
   * @param onErrorCallback
   * @returns {Offer} | undefined if validation was not successful
   */
  validateAndCreateNewOfferFromRequest: function (req, res, onErrorCallback) {
    var offerModel = new Offer();

    offerModel = this.validateAndSetOfferFromRequest(req, res, offerModel, LoginService.getCurrentUser(req), onErrorCallback);

    return offerModel;
  },

  /**
   * Validate the request values. On success, fill the model.
   * Otherwise, call onErrorCallback with validation errors set in the given error model.
   * @param req
   * @param res
   * @param offerModel
   * @param user
   * @param onErrorCallback
   * @returns {Offer} | undefined if validation was not successful
   */
  validateAndSetOfferFromRequest: function (req, res, offerModel, user, onErrorCallback) {
    // step 1: validate request parameters
    var validationResult = this.validateOfferFromRequest(req, res);

    if (!validationResult.success) {
      onErrorCallback(this.newValidationError(validationResult.validationErrors, validationResult.params));
      return undefined;
    } else {
      // step 2: fill model from request parameters
      return this.processOfferModelFromRequest(offerModel, user, validationResult.params);
    }
  },

  /**
   * Validate given offer parameters from request.
   * @param req
   * @param res
   * @returns {*}
   */
  validateOfferFromRequest: function (req, res) {
    var offerValidator = ValidationService.newOfferValidator(res.i18n);

    var tags = this.getTagsFromRequest(req),
      price = this.getSimplePriceFromRequest(req),
      latitude = this.getLatitudeFromRequest(req),
      longitude = this.getLongitudeFromRequest(req),
      images = this.getImagesFromRequest(req);

    if (!offerValidator.isValid(tags, price, latitude, longitude, images)) {
      return {
        success: false,
        validationErrors: offerValidator.getErrorMessages(),
        params: {
          tags: tags,
          price: price,
          lat: latitude,
          lng: longitude,
          images: images
        }
      };
    }

    return {
      success: true,
      params: {
        tags: tags,
        price: price,
        lat: latitude,
        lng: longitude,
        images: images
      }
    };
  },

  /**
   * Fill the offer model by the given params.
   *
   * @param offerModel
   * @param user
   * @param params
   * @returns {*}
   */
  processOfferModelFromRequest: function(offerModel, user, params) {
    return offerModel
            .setTags(this.newTagListFromParam(params.tags))
            .setPrice(this.newSimplePriceFromParam(params.price))
            .setLocation(this.newLocationFromParam(params.lat, params.lng))
            .setImageList(this.newImageListFromParam(params.images))
            .setUser(user);
  },


  validateAndCreateNewDemandFromRequest: function (req, res, onErrorCallback) {
    var demandModel = new Demand();

    demandModel = this.validateAndSetDemandFromRequest(req, res, demandModel, LoginService.getCurrentUser(req), onErrorCallback);

    return demandModel;
  },

  /**
   * Validate the request values. On success, fill the model.
   * Otherwise, call onErrorCallback with validation errors set in the given error model.
   * @param req
   * @param res
   * @param demandModel
   * @param user
   * @param onErrorCallback
   * @returns {Demand} | undefined if validation was not successful
   */
  validateAndSetDemandFromRequest: function (req, res, demandModel, user, onErrorCallback) {
    // step 1: validate request parameters
    var validationResult = this.validateDemandFromRequest(req, res);

    if (!validationResult.success) {
      onErrorCallback(this.newValidationError(validationResult.validationErrors, validationResult.params));
      return undefined;
    } else {
      // step 2: fill model from request parameters
      return this.processDemandModelFromRequest(demandModel, user, validationResult.params);
    }
  },

  /**
   * Validate demand request data.
   * @param req
   * @param res
   * @returns {*}
   */
  validateDemandFromRequest: function (req, res) {
    var demandValidator = ValidationService.newDemandValidator(res.i18n);

    var mustTags = this.getMustTagsFromRequest(req),
      shouldTags = this.getShouldTagsFromRequest(req),
      minPrice = this.getMinPriceFromRequest(req),
      maxPrice = this.getMaxPriceFromRequest(req),
      latitude = this.getLatitudeFromRequest(req),
      longitude = this.getLongitudeFromRequest(req),
      distance = this.getDistanceFromRequest(req);

    if (!demandValidator.isValid(mustTags, shouldTags, minPrice, maxPrice, latitude, longitude, distance)) {
      return {
        success: false,
        validationErrors: demandValidator.getErrorMessages(),
        params: {
          mustTags: mustTags,
          shouldTags: shouldTags,
          minPrice: minPrice,
          maxPrice: maxPrice,
          lat: latitude,
          lng: longitude,
          distance: distance
        }
      };
    }

    return {
      success: true,
      params: {
        mustTags: mustTags,
        shouldTags: shouldTags,
        minPrice: minPrice,
        maxPrice: maxPrice,
        lat: latitude,
        lng: longitude,
        distance: distance
      }
    };
  },

  /**
   * Fill the demand model by the given params.
   * @param demandModel
   * @param user
   * @param params
   * @returns {*}
   */
  processDemandModelFromRequest: function(demandModel, user, params) {
    return demandModel
      .setMustTags(this.newTagListFromParam(params.mustTags))
      .setShouldTags(this.newTagListFromParam(params.shouldTags))
      .setPrice(this.newDemandPriceFromParam(params.minPrice, params.maxPrice))
      .setLocation(this.newLocationFromParam(params.lat, params.lng))
      .setDistance(this.newDistanceFromParam(params.distance))
      .setUser(user);
  },

  validateAndCreateNewMessageFromRequest: function (req, res, onErrorCallback) {
    var messageModel = new Message();

    messageModel = this.validateAndSetMessageFromRequest(req, res, messageModel, LoginService.getCurrentUser(req), onErrorCallback);

    return messageModel;
  },

  validateAndSetMessageFromRequest: function (req, res, messageModel, sender, onErrorCallback) {
    var validationResult = this.validateMessageFromRequest(req, res);

    if (!validationResult.success) {
      onErrorCallback(this.newValidationError(validationResult.validationErrors, validationResult.params));
      return undefined;
    } else {
      return this.processMessageModelFromRequest(messageModel, sender, validationResult.params);
    }
  },

  validateMessageFromRequest: function (req, res) {
    var messageValidator = ValidationService.newMessageValidator(res.i18n);

    var messageBody = this.getMessageBodyFromRequest(req),
      recipientId = this.getRecipientIdFromRequest(req);

    if (!messageValidator.isValid(recipientId, messageBody)) {
      return {
        success: false,
        validationErrors: messageValidator.getErrorMessages(),
        params: {
          messageBody: messageBody,
          recipientId: recipientId
        }
      };
    }

    return {
      success: true,
      params: {
        messageBody: messageBody,
        recipientId: recipientId
      }
    };
  },

  /**
   * Fill the message model by the given params.
   * @param messageModel
   * @param user
   * @param params
   * @returns {*}
   */
  processMessageModelFromRequest: function(messageModel, user, params) {
    messageModel.setBody(params.messageBody)
          .setSender(user);
    messageModel.getRecipient().setId(params.recipientId);

    return messageModel;
  },

  setPaginationParameter: function (req, queryModel) {
    // pagination
    var limit = parseInt(req.param("limit", PaginatorService.getDefaultLimit()));
    var pageNumber = parseInt(req.param("page", PaginatorService.getFirstPageNumber()));
    var offset = PaginatorService.calculateOffset(limit, pageNumber);

    queryModel
      .setLimit(limit)
      .setOffset(offset);
  },

  setLocationParameterIfGiven: function (req, res, queryModel) {
    var location = this.buildUsersCurrentLocationObject(req, res);

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
  newDemandQueryFromRequest: function (req, res) {
    var queryModel = new DemandQuery();

    this.setPaginationParameter(req, queryModel);
    this.setLocationParameterIfGiven(req, res, queryModel);

    return queryModel;
  },

  /**
   * Build most-recent offer query object to be handed to neeedo-api-nodejs-client Demand Service.
   *
   * - Trigger logic to fill latLng values from request if given (otherwise fallback to default locations).
   *
   * @param req
   */
  newOfferQueryFromRequest: function (req, res) {
    var queryModel = new OfferQuery();

    this.setPaginationParameter(req, queryModel);
    this.setLocationParameterIfGiven(req, res, queryModel);

    return queryModel;
  },

  buildUsersCurrentLocationObject: function (req, res) {
    var latitude = this.getLatitudeFromRequest(req);
    var longitude = this.getLongitudeFromRequest(req);

    if (!ValidationService.newLocationValidator(res.i18n).isValid(latitude)
      || !ValidationService.newLocationValidator(res.i18n).isValid(longitude)) {
      // parameter did not contain latLng values, e.g. because the client could not determine -> get default location
      return this.newLocationFromParam(LocaleService.getDefaultLatitude(req), LocaleService.getDefaultLongitude(req));
    }

    return this.newLocationFromParam(latitude, longitude);
  },

  validateAndCreateNewOfferIdFromRequest: function (req, res, onErrorCallback) {
    var validationResult = ApiClientService.validateOfferIdFromRequest(req, res);

    if (!validationResult.success) {
      onErrorCallback(ApiClientService.newError("validateAndCreateNewOfferIdFromRequest: ", validationResult.message));
      return undefined;
    } else {
      return validationResult.offerId;
    }
  },

  validateOfferIdFromRequest: function (req, res) {
    var offerId = this.getOfferIdFromRequest(req);

    var idValidator = ValidationService.newIdValidator(res.i18n);

    if (undefined === offerId
      || !idValidator.isValid(offerId)) {
      sails.log.error('is not valid : offer Id ' + offerId);
      return {
        success: false,
        message: idValidator.getErrorMessages(),
        offerId: offerId
      };
    }

    sails.log.error('is valid : offer Id ' + offerId);
    return {
      success: true,
      message: '',
      offerId: offerId
    };
  },

  validateAndCreateNewDemandIdFromRequest: function (req, res, onErrorCallback) {
    var validationResult = this.validateDemandIdFromRequest(req, res);

    if (!validationResult.success) {
      onErrorCallback(ApiClientService.newError("validateAndCreateNewDemandIdFromRequest: ", validationResult.message));
      return undefined;
    } else {
      return validationResult.demandId;
    }
  },

  validateDemandIdFromRequest: function (req, res) {
    var demandId = this.getDemandIdFromRequest(req);

    var idValidator = ValidationService.newIdValidator(res.i18n);

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

  validateAndCreateNewFavoriteFromRequest: function (req, res, onErrorCallback) {
    var validationResult = ApiClientService.validateFavoriteFromRequest(req, res);

    if (!validationResult.success) {
      onErrorCallback(ApiClientService.newError("validateAndCreateNewFavoriteFromRequest: ", validationResult.message));
      return undefined;
    } else {
     return this.processFavoriteModelFromRequest(LoginService.getCurrentUser(req), validationResult.params);
    }
  },

  validateFavoriteFromRequest: function (req, res) {
    var offerId = this.getOfferIdFromRequest(req);

    var idValidator = ValidationService.newIdValidator(res.i18n);

    if (!idValidator.isValid(offerId)) {
      return {
        success: false,
        message: idValidator.getErrorMessages(),
        params: {
          offerId: offerId
        }
      };
    }

    return {
      success: true,
      message: '',
      params: {
        offerId: offerId
      }
    };
  },

  /**
   * Fill the favorite model by the given params.
   * @param user
   * @param params
   * @returns {*}
   */
  processFavoriteModelFromRequest: function(user, params) {
    return new Favorite()
      .setOffer(new Offer().setId(params.offerId))
      .setUser(user);
  }
};
