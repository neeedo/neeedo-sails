/*
 * dependencies
 */
var ResetUploadedFilesPolicy = require('../../../api/policies/resetUploadedFiles'),
  sinon = require('sinon'),
  should = require('should');

var givenAFileService = function () {
  return sinon.stub(sails.services.fileservice, 'resetLeastUploadedFiles');
};

var restoreFileService = function () {
  sails.services.fileservice.resetLeastUploadedFiles.restore();
};

describe('[UNIT TEST] resetUploadedFiles policy', function () {
  var fileService;
  before(function (done) {
    fileService = givenAFileService();

    done();
  });

  after(function (done) {
    restoreFileService();

    done();
  });

  it("should delegate to file service and proceed to next policy", function (done) {
    var nextFunctionSpy = sinon.spy(),
      req = {},
      res = {};

    // trigger policy
    ResetUploadedFilesPolicy(req, res, nextFunctionSpy);

    fileService.withArgs(req).calledOnce.should.be.True;
    nextFunctionSpy.calledOnce.should.be.True;

    done();
  });
});
