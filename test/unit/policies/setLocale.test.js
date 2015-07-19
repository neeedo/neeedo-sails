/*
 * dependencies
 */
var SetLocalePolicy = require('../../../api/policies/setLocale'),
    sinon = require('sinon'),
    should = require('should');

var givenALocalServiceMock = function() {
  return sinon.mock(sails.services.localeservice);
};

describe('[UNIT TEST] setLocale policy', function () {
  describe('if locale could be determined', function() {
    var localeServiceMock, req;

    before(function(done){
      localeServiceMock = givenALocalServiceMock(true);

      done();
    });

    after(function(done){
      done();
    });

    it("delegates to locale service and proceeds in policy chain", function (done) {
      var req = {}, res = {},
        nextFunctionSpy = sinon.spy();

      localeServiceMock.expects("readUsersPreferedLocaleOrReturnDefault").returns("en");
      localeServiceMock.expects("setUsersPreferedLocaleInRequest").once();

      // trigger policy
      SetLocalePolicy(req, res, nextFunctionSpy);

      localeServiceMock.verify();
      nextFunctionSpy.calledOnce.should.be.True;

      done();
    });
  });

  describe('if locale could not be determined', function() {
    var localeServiceMock, req;

    before(function(done){
      localeServiceMock = givenALocalServiceMock(true);

      done();
    });

    after(function(done){
      done();
    });

    it("should proceed in policy chain", function (done) {
      var req = {}, res = {},
        nextFunctionSpy = sinon.spy();

      localeServiceMock.expects("readUsersPreferedLocaleOrReturnDefault").returns(false);
      localeServiceMock.expects("setUsersPreferedLocaleInRequest").never();

      // trigger policy
      SetLocalePolicy(req, res, nextFunctionSpy);

      localeServiceMock.verify();
      nextFunctionSpy.calledOnce.should.be.True;

      done();
    });
  });

});
