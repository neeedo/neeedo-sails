var ApiClientService = require('../../api/services/ApiClientService'),
   apiNodeJsClient = require('neeedo-api-nodejs-client')
  ;

module.exports  = {
  /**
   * Get a bare validator object that can be used for mocking.
   * @returns {{isValid: Function, getErrorMessages: Function}}
   */
  newValidator: function() {
    return {
      isValid: function(value) { return true; },
      getErrorMessages: function() {}
    }
  },

  newCreateOfferRequestStub: function() {
    return {
      param: function (key) {
        switch(key) {
          case ApiClientService.PARAM_TAGS_KEY:
                return "tag1,tag2";
          case ApiClientService.PARAM_SIMPLE_PRICE_KEY:
                return 10;
          case ApiClientService.PARAM_LATITUDE_KEY:
                return 55.321;
          case ApiClientService.PARAM_LONGITUDE_KEY:
                return 412.23;
          case ApiClientService.PARAM_IMAGES_KEY:
                return ["someimage.jpg"];
          default:
                return "don't care about the value";
        }
      }
    }
  },

  newCreateDemandRequestStub: function() {
    return {
      param: function (key) {
        switch(key) {
          case ApiClientService.PARAM_MUST_TAGS_KEY:
                return "tag1,tag2";
          case ApiClientService.PARAM_SHOULD_TAGS_KEY:
                return "tag3,tag4";
          case ApiClientService.PARAM_MIN_PRICE_KEY:
                return 55.321;
          case ApiClientService.PARAM_MAX_PRICE_KEY:
                return 412.23;
          case ApiClientService.PARAM_LATITUDE_KEY:
            return 55.321;
          case ApiClientService.PARAM_LONGITUDE_KEY:
            return 412.23;
          case ApiClientService.PARAM_DISTANCE_KEY:
            return 20;
          default:
                return "don't care about the value";
        }
      }
    }
  },

  newLocationStub: function(lat, lng) {
    var location = new apiNodeJsClient.models.Location;

    return location.setLatitude(lat).setLongitude(lng);
  },

  newOfferStub: function() {
    var offer = new apiNodeJsClient.models.Offer();

    return offer.setId("offer1")
      .setTags(["tag1", "tag2"])
      .setPrice(10)
      .setLocation(this.newLocationStub(55.321, 41.23))
      .setVersion(1)
      .setUser({});

    return offer;
  },

  newDemandStub: function() {
    var demand = new apiNodeJsClient.models.Demand();

    return demand.setId("offer1")
      .setMustTags(["tag1", "tag2"])
      .setShouldTags(["tag3", "tag4"])
      .setPrice(this.newDemandPrice(10, 20))
      .setLocation(this.newLocationStub(55.321, 41.23))
      .setVersion(1)
      .setDistance(10)
      .setUser(this.newUserStub());

    return offer;
  },

  newDemandPrice: function(min, max) {
    var demandPrice = new apiNodeJsClient.models.DemandPrice();
    return demandPrice.setMin(min).setMax(max);
  },

  newOfferListStub: function(withOffers) {
    var offerList = new apiNodeJsClient.models.OfferList();

    if (withOffers) {
      offerList.addOffer(this.newOfferStub());
    }

    return offerList;
  },

  newFavoriteListSub: function() {
    var favList = new apiNodeJsClient.models.OfferList();
    var favOffer = this.newOfferStub();

    return favList.addOffer(favOffer);
  },

  newUserStub: function() {
    var user = new apiNodeJsClient.models.User();

    return user.setUsername("max").setEMail("max@muster.de");
  },

  newFavoriteStub: function() {
    var fav = new apiNodeJsClient.models.Favorite();

    return fav.setOffer(this.newOfferStub()).setUser(this.newUserStub());
  },

  newConversationStub: function() {
    var conversation = new apiNodeJsClient.models.Conversation();

    return conversation.setSender(this.newUserStub());
  },

  newMessageStub: function() {
    var message = new apiNodeJsClient.models.Message();

    return message.setId("message1234");
  },

  newMessageListStub: function() {
    var messageList = new apiNodeJsClient.models.MessageList();

    messageList.addMessage(this.newMessageStub());

    return messageList;
  }
};
