var should = require('should'),
    sinon = require('sinon'),
    apiClient = require('neeedo-api-nodejs-client'),
    registrationController = require('../../../api/controllers/RegistrationController'),
    req = require('../../../node_modules/sails/node_modules/express/lib/request')
  ;


var givenAPostRequestWithRegistrationParameters = function() {
  req.method = 'POST';

  // let's overwrite param function to return Registration request data
  req.param = function(paramName) {
    switch (paramName) {
      case 'email' : return "max@mustermann.de";
      case 'password' : return "insecure";
      case 'username' : return "maxmuster";
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

var givenARegisterService = function() {
  return sinon.stub(sails.services.registerservice, 'registerUser');
};

var restoreRegisterService = function() {
  sails.services.registerservice.registerUser.restore();
};

//#############################
// TESTS
//#############################

describe('[UNIT TEST] RegistrationController', function() {

  describe('register action', function() {
    var stubbedReq, stubbedRes;

    before(function(done){
      stubbedReq = givenAGetRequest();
      stubbedRes = givenAResponse();

      done();
    });

    after(function(done){

      done();
    });

    it('should print regsitration view on GET', function (done) {
      this.timeout(20000);

      // when registration is called
      registrationController.register(stubbedReq, stubbedRes);

      // then the following view should be called
      stubbedRes.view.calledWith(
        'registration/register'
      ).should.be.True;

      done();
    });
  });

  describe('register action', function() {
      var stubbedReq, stubbedRes, registerService;

      before(function(done){
        stubbedReq = givenAPostRequestWithRegistrationParameters();
        stubbedRes = sinon.stub();
        registerService = givenARegisterService();

        done();
      });

      after(function(done){
        restoreRegisterService();

        done();
      });

    it('should delegate to RegistrationService on POST', function (done) {
      this.timeout(20000);

      // when login is called
      registrationController.register(stubbedReq, stubbedRes);

      // then the register service method should be called with the correct request parameters
      registerService.calledOnce.should.be.True;
      registerService.calledWith("max@mustermann.de", "maxmuster", "insecure").should.be.True;

      done();
    });
  });
});
