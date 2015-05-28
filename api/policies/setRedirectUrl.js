/**
 * setRedirectUrl
 *
 * @module      :: Policy
 * @description :: Store the current URL so that a future redirect is possible.
 *
 */
module.exports = function(req, res, next) {
  UrlService.setRedirectUrl(req);

  return next();
};
