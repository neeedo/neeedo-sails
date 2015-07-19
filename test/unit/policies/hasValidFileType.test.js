/*
 * dependencies
 */
var HasValidFileTypePolicy = require('../../../api/policies/hasValidFileType'),
    sinon = require('sinon'),
    should = require('should');

var givenAFileService = function() {
  return sinon.stub(sails.services.fileservice, 'getFileTypeAdapter', function() {
    return {"jpg" : "jpg", "png" : "png"};
  });
};

var restoreFileService = function() {
  sails.services.fileservice.getFileTypeAdapter.restore();
};

var givenAnUrlService = function() {
  return sinon.stub(sails.services.urlservice, 'redirectToLastRedirectUrl', function() { return true; });
};

var restoreUrlService = function() {
  sails.services.urlservice.redirectToLastRedirectUrl.restore();
};

var getReq = function(fileParam) {
  return {
    param: function(name, defaultValue) {
      return fileParam;
    }
  };
};

var getRes = function() {
  return {};
};

var givenAFlashMessageServiceStub = function() {
  return sinon.stub(sails.services.flashmessagesservice, "setErrorMessage");
};

var restoreFlashMessageServiceStub = function() {
  sails.services.flashmessagesservice.setErrorMessage.restore();
};

describe('[UNIT TEST] hasValidFile type policy', function () {
  var flashMessagesStub, fileServiceStub, urlServiceStub, nextFunctionSpy, req, res;

  before(function(done){
    flashMessagesStub = givenAFlashMessageServiceStub();
    fileServiceStub = givenAFileService();
    urlServiceStub = givenAnUrlService();
    res = getRes();

    done();
  });

  after(function(done){
    restoreFlashMessageServiceStub();
    restoreFileService();
    restoreUrlService();
    nextFunctionSpy.reset();

    done();
  });

  it("should set error message and redirect to last redirect URL if no valid file type is given", function (done) {
    req = getReq("invalidFileType");
    nextFunctionSpy = sinon.spy();

    // trigger policy
    HasValidFileTypePolicy(req, res, nextFunctionSpy);

    flashMessagesStub.calledOnce.should.be.True;
    urlServiceStub.calledOnce.should.be.True;
    nextFunctionSpy.calledOnce.should.be.False;

    done();
  });


  it("should call next policy in chain on success", function (done) {
    req = getReq("jpg");
    nextFunctionSpy = sinon.spy();

    // trigger policy
    HasValidFileTypePolicy(req, res, nextFunctionSpy);

    nextFunctionSpy.calledOnce.should.be.True;

    done();
  });

});
