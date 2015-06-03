var should = require('should'),
    sinon = require('sinon'),
    apiClient = require('neeedo-api-nodejs-client'),
    offerController = require('../../../api/controllers/OfferController'),
    req = require('../../../node_modules/sails/node_modules/express/lib/request')
  ;


var givenAPostRequestWithOfferParameters = function() {
  req.method = 'POST';

  // let's overwrite param function to return Demand request data
  req.param = function(paramName) {
    switch (paramName) {
      case 'tags' : return "tag1,tag2";
      case 'price' : return 10;
      case 'lat' : return 55.555;
      case 'lng' : return 55.555;
    }
  };

  return req;
};

var givenAGetRequest = function() {
  req.method = 'GET';

  return req;
};

var givenAResponse = function() {
  return sinon.stub({ view : function(path, variables) {}});
}

var givenAnOfferService = function() {
  return sinon.stub(sails.services.offerservice, 'createOffer');
};

var restoreOfferService = function() {
  sails.services.offerservice.createOffer.restore();
};
var givenAnFileService = function() {
  return sinon.stub(sails.services.fileservice, 'getLeastUploadedFiles', function() { return ''; });
};

var restoreFileService = function() {
  sails.services.fileservice.getLeastUploadedFiles.restore();
};

var givenAUserService = function() {
  return sinon.stub(sails.services.loginservice, 'getCurrentUser');
};

var restoreUserService = function() {
  sails.services.loginservice.getCurrentUser.restore();
};

//#############################
// TESTS
//#############################

describe('[UNIT TEST] OfferController', function() {

  describe('create action', function() {
    var stubbedReq, stubbedRes;

    before(function(done){
      stubbedReq = givenAGetRequest();
      stubbedRes = givenAResponse();

      givenAnFileService();

      done();
    });

    after(function(done){
      restoreFileService();

      done();
    });

    it('should print default offer values on GET', function (done) {
      this.timeout(20000);

      // when create action is called
      offerController.create(stubbedReq, stubbedRes);

      // the following view with the default offer parameters should be called
      stubbedRes.view.calledWith(
        'offer/create', {
          locals: {
            tags: "tag1, tag2,...",
            price: 10,
            lat: 35.92516,
            lng: 12.37528,
            images: "",
            btnLabel: 'Create'
          }
        }
      ).should.be.True;

      done();
    });
  });

  describe('create action', function() {
      var stubbedReq, stubbedRes, offerService, userService;

      before(function(done){
        stubbedReq = givenAPostRequestWithOfferParameters();
        res = sinon.stub();
        offerService = givenAnOfferService();
        userService = givenAUserService();

        done();
      });

      after(function(done){
        restoreOfferService();
        restoreUserService();

        done();
      });

    it('should delegate to OfferService on POST', function (done) {
      this.timeout(20000);

      // when create action is called
      offerController.create(stubbedReq, stubbedRes);

      // the offer service method should be called with the given request parameters
      offerService.calledOnce.should.be.True;
      offerService.calledWith(stubbedReq).should.be.True;

      done();
    });
  });
});
