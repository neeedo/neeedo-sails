
module.exports = {

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
  }
};
