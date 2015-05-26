module.exports = {
  calculateOffset: function(limit, pageNumber) {
    return (pageNumber - this.getFirstPageNumber()) * limit;
  },
  getFirstPageNumber: function() {
    return sails.config.webapp.matching.firstPageNumber;
  },
  getDefaultLimit: function() {
    return sails.config.webapp.matching.defaultLimit;
  }
};
