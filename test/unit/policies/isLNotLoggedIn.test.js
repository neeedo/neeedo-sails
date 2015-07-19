/*
 * dependencies
 */
var IsNotLoggedInPolicy = require('../../../api/policies/isNotLoggedIn'),
    sinon = require('sinon'),
    should = require('should');

var givenAIsLoggedInService = function(isloggedIn) {
  return sinon.stub(sails.services.loginservice, 'userIsLoggedIn', function(req) {
    return isloggedIn;
  });
};

var getReq = function() {
  return {
  };
};

var givenAResStub = function() {
  return sinon.stub({ redirect : function(url) {}});
};

var restoreLoginServce = function(){
  return sails.services.loginservice.userIsLoggedIn.restore();
};

describe('[UNIT TEST] isNotLoggedIn type policy', function () {
  describe(' if user is not logged in', function() {
    var loginServiceStub, req;

    before(function(done){
      req = getReq();
      loginServiceStub = givenAIsLoggedInService(false);

      done();
    });

    after(function(done){
      restoreLoginServce();

      done();
    });

    it("should proceed to next policy", function (done) {
      var nextFunctionSpy = sinon.spy(),
        resSpy = sinon.spy({
          redirect: function () {
          }
        }, "redirect");

      // trigger policy
      IsNotLoggedInPolicy(req, resSpy, nextFunctionSpy);

      loginServiceStub.calledOnce.should.be.True;
      resSpy.withArgs('dashboard').calledOnce.should.be.False;
      nextFunctionSpy.calledOnce.should.be.True;

      done();
    });
  });

  describe(' if user is logged in', function() {
    var loginServiceStub, req, resStub;

    before(function(done){
      req = getReq();
      loginServiceStub = givenAIsLoggedInService(true);
      resStub = givenAResStub();

      done();
    });

    after(function(done){
      restoreLoginServce();

      done();
    });

    it("should redirect to dashboard action", function (done) {
      var nextFunctionSpy = sinon.spy();

      // trigger policy
      IsNotLoggedInPolicy(req, resStub, nextFunctionSpy);

      loginServiceStub.calledOnce.should.be.True;
      resStub.redirect.withArgs('dashboard').calledOnce.should.be.True;
      nextFunctionSpy.calledOnce.should.be.False;

      done();
    });
  });

});
