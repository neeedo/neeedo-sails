var should = require('should'),
    sinon = require('sinon'),
    apiClient = require('neeedo-api-nodejs-client'),
    userController = require('../../api/controllers/UserController'),
    req = require('../../node_modules/sails/node_modules/express/lib/request')
  ;


var givenARequestWithSetLocaleParameters = function() {
  // let's overwrite param function to return request data
  req.param = function(paramName) {
    switch (paramName) {
      case 'locale' : return "de";
    }
  };

  return req;
};

var givenAGetRequest = function() {
  req.method = 'GET';

  return req;
};

var givenAResponse = function() {
  return sinon.stub({ view : function(path, variables) {}, redirect : function(url) {}});
}

var givenALocalServiceMock = function() {
  var locale = sinon.mock(sails.services.localeservice);

  return locale;
};

var restoreLocaleService = function() {
  sails.services.localeservice.restore();
 };

var givenAnUrlService = function() {
  return sinon.stub(sails.services.urlservice, 'redirectToLastRedirectUrl', function() { return false; }) ;
};

var restoreUrlService = function() {
  sails.services.urlservice.redirectToLastRedirectUrl.restore();
};

//#############################
// TESTS
//#############################

describe('[UNIT TEST] UserController', function() {
  describe('setLocale action', function() {
      var stubbedReq, stubbedRes, localeService, urlService;

      before(function(done){
        stubbedReq = givenARequestWithSetLocaleParameters();
        stubbedRes = givenAResponse();
        localeService = givenALocalServiceMock();
        urlService = givenAnUrlService();

        done();
      });

      after(function(done){
        //restoreLocaleService();
        restoreUrlService();

        done();
      });

    it('should delegate to services', function (done) {
      this.timeout(20000);

      localeService.expects('isValidLocale').returns(true);
      localeService.expects('saveUsersPreferedLocale').once();
      localeService.expects('setUsersPreferedLocaleInRequest').once();

      // when set locale is called
      userController.setLocale(stubbedReq, stubbedRes);

      localeService.verify();

      // when no redirect URL is given, redirect to dashboard
      stubbedRes.redirect.calledWith('/dashboard').should.be.True;

      done();
    });
  });
});
