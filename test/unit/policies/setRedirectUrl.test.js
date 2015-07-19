/*
 * dependencies
 */
var SetRedirectUrlPolicy = require('../../../api/policies/setRedirectUrl'),
  sinon = require('sinon'),
  should = require('should');

var givenAnUrlService = function () {
  return sinon.stub(sails.services.urlservice, 'setRedirectUrl');
};

var restoreUrlService = function () {
  sails.services.urlservice.setRedirectUrl.restore();
};

describe('[UNIT TEST] setRedirectUrl policy', function () {
  var urlService;

  before(function (done) {
    urlService = givenAnUrlService();

    done();
  });

  after(function (done) {
    restoreUrlService();

    done();
  });

  it("should delegate to url service and proceed to next policy", function (done) {
    var nextFunctionSpy = sinon.spy(),
      req = {},
      res = {};

    // trigger policy
    SetRedirectUrlPolicy(req, res, nextFunctionSpy);

    urlService.withArgs(req).calledOnce.should.be.True;
    nextFunctionSpy.calledOnce.should.be.True;

    done();
  });
});
