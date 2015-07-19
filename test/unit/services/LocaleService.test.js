/*
 * dependencies
 */
var LocaleService = require('../../../api/services/LocaleService'),
    Factory = require('../../library/Factory')
    sinon = require('sinon'),
    should = require('should');

var givenALocaleServiceCookieNameStub = function(cookieName) {
  return sinon.stub(sails.services.localeservice, "getLocaleCookieName", function() {return  cookieName; } );
};

var restoreLocaleServiceCookieNameStub = function() {
  sails.services.localeservice.getLocaleCookieName.restore();
};

var givenALocaleServiceIsValidStub = function(isValid) {
  return sinon.stub(sails.services.localeservice, "isValidLocale", function(locale) {return isValid; } );
};

var restoreLocaleServiceIsValidStub = function() {
  sails.services.localeservice.isValidLocale.restore();
};

var givenALocaleServiceUsersPreferedLocaleStub = function(locale) {
  return sinon.stub(sails.services.localeservice, "readUsersPreferedLocaleOrReturnDefault", function(req) {return locale; } );
};

var restoreLocaleServiceUsersPreferedLocaleStub = function() {
  sails.services.localeservice.readUsersPreferedLocaleOrReturnDefault.restore();
};

var getReqStub = function() {
  return {
    cookies: {
      usersLocale: "customLocale"
    }
  }
};

describe('[UNIT TEST] LocaleService', function () {

  describe('readUsersPreferedLocaleOrReturnDefault', function() {
    before(function(done){
      givenALocaleServiceCookieNameStub("usersLocale");
      givenALocaleServiceIsValidStub(true);

      done();
    });

    after(function(done){
      restoreLocaleServiceCookieNameStub();
      restoreLocaleServiceIsValidStub();

      done();
    });

    it("reads from cookie if is valid locale", function (done) {
      var req = getReqStub();

      var returnValue = sails.services.localeservice.readUsersPreferedLocaleOrReturnDefault(req);

      // locale in request cookie should be returned
      returnValue.should.be.equal("customLocale");

      done();
    });
  });

  describe('readUsersPreferedLocaleOrReturnDefault', function() {
    before(function(done){
      givenALocaleServiceCookieNameStub("usersLocale");
      givenALocaleServiceIsValidStub(false);

      done();
    });

    after(function(done){
      restoreLocaleServiceCookieNameStub();
      restoreLocaleServiceIsValidStub();

      done();
    });

    it("reads from default config if is not valid", function (done) {
      var req = getReqStub();

      var returnValue = sails.services.localeservice.readUsersPreferedLocaleOrReturnDefault(req);

      // locale in webapp config should be returned
      returnValue.should.be.equal(sails.config.i18n.defaultLocale);

      done();
    });
  });

  describe('isValidLocale', function() {
    it("works correct", function (done) {
      sails.services.localeservice.isValidLocale("en").should.be.True;
      sails.services.localeservice.isValidLocale("de").should.be.True;
      sails.services.localeservice.isValidLocale("someothervalue").should.be.False;

      done();
    });
  });

  describe('getLocaleCookieSettings', function() {
    it("returns expire date in future", function (done) {
      (sails.services.localeservice.getLocaleCookieSettings().expires > new Date()).should.be.True;

      done();
    });
  });

  describe('getDefaultLocation', function() {
    before(function(done){
      givenALocaleServiceUsersPreferedLocaleStub("en");

      done();
    });

    after(function(done){
      restoreLocaleServiceUsersPreferedLocaleStub();

      done();
    });

    it("returns expected latLng object", function (done) {
      var req = getReqStub();

      sails.services.localeservice.getDefaultLocation().should.be.Object;
      sails.services.localeservice.getDefaultLocation().should.have.property("latitude");
      sails.services.localeservice.getDefaultLocation().should.have.property("longitude");

      done();
    });
  });

  describe('getDefaultLatitude', function() {
    before(function(done){
      givenALocaleServiceUsersPreferedLocaleStub("en");

      done();
    });

    after(function(done){
      restoreLocaleServiceUsersPreferedLocaleStub();

      done();
    });

    it("returns number", function (done) {
      var req = getReqStub();

      sails.services.localeservice.getDefaultLatitude().should.be.Number;

      done();
    });
  });

  describe('getDefaultLongitude', function() {
    before(function(done){
      givenALocaleServiceUsersPreferedLocaleStub("en");

      done();
    });

    after(function(done){
      restoreLocaleServiceUsersPreferedLocaleStub();

      done();
    });

    it("returns number", function (done) {
      var req = getReqStub();

      sails.services.localeservice.getDefaultLongitude().should.be.Number;

      done();
    });
  });

  describe('formatTimestamp', function() {
    it("returns expected date string", function (done) {
      var date = new Date(1437336976000);

      // let's prepend the first date parts here to be independent of server time (e.g. UTC)
      sails.services.localeservice.formatTimestamp(1437336976000).should.be.equal(
        date.getDate() + "." + (date.getMonth() + 1)  + "." + date.getFullYear() + " - 22:16");

      done();
    });
  });
});
