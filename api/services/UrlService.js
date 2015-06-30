
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

      sails.log.info('redirecting to ' + redirectTo);
      return true;
    }

    sails.log.info('not redirecting');

    return false;
  },

  setRedirectUrl: function(req) {
    req.session.redirectUrl = req.url;
  }
};
