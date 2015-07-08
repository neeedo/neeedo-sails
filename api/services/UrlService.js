
module.exports = {
  baseUrl : undefined,

  to: function(destination) {
    // currently meaned to be wrapper
    return destination;
  },

  redirectToLastRedirectUrl: function(req, res) {
    if ("redirectUrl" in req.session) {
      var redirectTo = req.session.redirectUrl;

      res.redirect(redirectTo);
      delete req.session['redirectUrl'];

      return true;
    }

    return false;
  },

  setRedirectUrl: function(req) {
    if (this.isValid(req.url)) {
      sails.log.info('setting redirect url: ' + req.url);
      req.session.redirectUrl = req.url;
    }
  },

  isValid: function(url) {
    // bugfix TODO find out where this request is coming from
    return (-1 == url.indexOf("image"));
  },

  getBaseUrl: function() {
    if (undefined == this.baseUrl) {
      // replace port 80 by the empty string so that the links look better to the user
      this.baseUrl = sails.getBaseurl().replace(":80", "");
    }

    return this.baseUrl;
  }
};
