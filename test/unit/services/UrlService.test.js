/*
 * dependencies
 */
var UrlService = require('../../../api/services/UrlService'),
    Factory = require('../../library/Factory')
    sinon = require('sinon'),
    should = require('should');

var givenAResStubWithSpy = function(spy) {
  return {
    redirect: spy
  }
};

var givenReqStubWithRedirectUrl = function(url) {
  return {
    session: {
      redirectUrl: url
    }
  }
};

var givenReqStubWithoutRedirectUrl = function() {
  return {
    session: {
    }
  }
};

var givenReqStubWithUrl = function(url) {
  return {
    url: url,
    session: {}
  }
};

var givenAnSailsBaseUrlStub = function(url) {
  return sinon.stub(sails, "getBaseurl", function() {return url; });
};

var restoreSailsBaseUrlStub = function() {
  sails.getBaseurl.restore();
};

describe('[UNIT TEST] UrlService', function () {

  describe('redirectToLastRedirectUrl', function() {
    it("redirects to URL in session if given", function (done) {
      var redirectSpy = sinon.spy();

      var req = givenReqStubWithRedirectUrl("someurl"),
          response = givenAResStubWithSpy(redirectSpy)
        ;

      sails.services.urlservice.redirectToLastRedirectUrl(req, response).should.be.True;

      // locale in request cookie should be returned
      redirectSpy.withArgs("someurl").called.should.be.True;

      done();
    });
  });

  describe('redirectToLastRedirectUrl', function() {
    it("returns false if no redirect in sesion", function (done) {
      var redirectSpy = sinon.spy();

      var req = givenReqStubWithoutRedirectUrl(),
          response = givenAResStubWithSpy(redirectSpy)
        ;

      sails.services.urlservice.redirectToLastRedirectUrl(req, response).should.be.False;

      // locale in request cookie should be returned
      redirectSpy.withArgs("someurl").called.should.be.False;

      done();
    });
  });

  describe('setRedirectUrl', function() {
    it("should set url in session if is valid", function (done) {
      var req = givenReqStubWithUrl("newurl")
        ;

      sails.services.urlservice.setRedirectUrl(req);

      // locale in request cookie should be returned
      req.session.redirectUrl.should.be.equal("newurl");

      done();
    });
  });

  describe('getBaseUrl', function() {
    before(function(done){
      givenAnSailsBaseUrlStub("http://somebaseurl.de:80");

      done();
    });

    after(function(done){
      restoreSailsBaseUrlStub();

      done();
    });

    it("should replace port 80 in base URL", function (done) {
      sails.services.urlservice.getBaseUrl().should.be.equal("http://somebaseurl.de");

      done();
    });
  });

});
