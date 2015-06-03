var should = require('should'),
    sinon = require('sinon'),
    apiClient = require('neeedo-api-nodejs-client'),
    loginController = require('../../../api/controllers/LoginController'),
    req = require('../../../node_modules/sails/node_modules/express/lib/request')
  ;

var User = apiClient.models.User;

var givenAPostRequestWithLoginParameters = function() {
  req.method = 'POST';

  // let's overwrite param function to return Demand request data
  req.param = function(paramName) {
    switch (paramName) {
      case 'email' : return "max@mustermann.de";
      case 'password' : return "insecure";
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

var givenALoginService = function() {
  return sinon.stub(sails.services.loginservice, 'queryUser');
};

var givenALogoutService = function() {
  return sinon.stub(sails.services.loginservice, 'logoutUser');
};

var restoreLoginService = function() {
  sails.services.loginservice.queryUser.restore();
};

var restoreLogoutService = function() {
  sails.services.loginservice.logoutUser.restore();
};

//#############################
// TESTS
//#############################

describe('[UNIT TEST] LoginController', function() {

  describe('login action', function() {
    var stubbedReq, stubbedRes;

    before(function(done){
      stubbedReq = givenAGetRequest();
      stubbedRes = givenAResponse();

      done();
    });

    after(function(done){

      done();
    });

    it('should print login view on GET', function (done) {
      this.timeout(20000);

      // when login is called
      loginController.login(stubbedReq, stubbedRes);

      // then the following view should be called
      stubbedRes.view.calledWith(
        'login/login'
      ).should.be.True;

      done();
    });
  });

  describe('login action', function() {
      var stubbedReq, stubbedRes, loginService;

      before(function(done){
        stubbedReq = givenAPostRequestWithLoginParameters();
        stubbedRes = sinon.stub();
        loginService = givenALoginService();

        done();
      });

      after(function(done){
        restoreLoginService();

        done();
      });

    it('should delegate to LoginService on POST', function (done) {
      this.timeout(20000);

      // when login is called
      loginController.login(stubbedReq, stubbedRes);

      // then the login service method should be called with the correct request parameters
      loginService.calledOnce.should.be.True;
      loginService.calledWith(stubbedReq).should.be.True;

      done();
    });
  });

  describe('logout action', function() {
      var stubbedReq, stubbedRes, logoutService;

      before(function(done){
        stubbedReq = givenAPostRequestWithLoginParameters();
        stubbedRes = givenAResponse();
        logoutService = givenALogoutService();

        done();
      });

      after(function(done){
        restoreLogoutService();

        done();
      });

    it('should delegate to LoginService', function (done) {
      this.timeout(20000);

      // when logout is called
      loginController.logout(stubbedReq, stubbedRes);

      // then the logout service method should be called with the request argument
      logoutService.calledOnce.should.be.True;
      logoutService.calledWith(stubbedReq).should.be.True;

      // and it should be redirected to the following URL
      stubbedRes.redirect.calledWith('/').should.be.True;

      done();
    });
  });
});
