/**
 * setLocale
 *
 * @module      :: Policy
 * @description :: Set the user's prefered locale if he/she set it.
 *
 */
module.exports = function(req, res, next) {
  var usersLocale = LocaleService.readUsersPreferedLocale(req);

  if (false !== usersLocale) {
    LocaleService.setUsersPreferedLocaleInRequest(req, usersLocale);
  }

  return next();
};
