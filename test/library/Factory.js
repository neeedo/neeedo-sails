var ApiClientService = require('../../api/services/ApiClientService');

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
  }
};
