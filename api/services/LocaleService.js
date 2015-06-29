module.exports = {
  setUsersPreferedLocaleInRequest: function(req, usersLocale) {
    req.setLocale(usersLocale);
  },

  saveUsersPreferedLocale: function(res, locale) {
     res.cookie(this.getLocaleCookieName(), locale, this.getLocaleCookieSettings());
  },

  readUsersPreferedLocaleOrReturnDefault: function(req) {
    var cookieName = this.getLocaleCookieName();

    if (cookieName in req.cookies && this.isValidLocale(req.cookies[cookieName]))
     {
      return req.cookies[cookieName];
    }

    return sails.config.i18n.defaultLocale;
  },

  isValidLocale: function(locale) {
    return -1 !== this.getAvailableLocales().indexOf(locale);
  },

  getLocaleCookieName: function() {
    return 'neeedo_locale';
  },

  getLocaleCookieSettings: function() {
    return {
      expires: new Date(Date.now() + sails.config.webapp.cookie.maxAge),
      httpOnly: sails.config.webapp.cookie.httpOnly
    };
  },


  getAvailableLocales: function() {
    return sails.config.i18n.locales;
  },

  getSetLocaleUrl: function(locale) {
    return '/user/setLocale/locale/' + locale;
  },

  getRedirectUrl: function(req) {
    return LoginService.getRedirectUrl(req);
  },

  getDefaultLocation: function(req) {
    var actLocale = this.readUsersPreferedLocaleOrReturnDefault(req);

    return sails.config.webapp.geolocation.defaults[actLocale];
  },

  getDefaultLatitude: function(req) {
    return this.getDefaultLocation(req).latitude;
  },

  getDefaultLongitude: function(req) {
    return this.getDefaultLocation(req).longitude;
  }

};
