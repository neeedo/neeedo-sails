
module.exports = {

  getDefaultZoomStep: function() {
    return sails.config.webapp.map.defaultZoomStep;
  },

  getItemLimit: function() {
    return sails.config.webapp.map.itemLimit;
  }

};
