var should = require('should'),
    sinon = require('sinon'),
    demandService = require('../../../api/services/DemandService'),
    ClientDemandListService = require('../../../node_modules/neeedo-api-nodejs-client/services/demand-list'),
    ClientDemandService = require('../../../node_modules/neeedo-api-nodejs-client/services/demand'),
    ClientDemandModel = require('../../../node_modules/neeedo-api-nodejs-client/models/demand'),
    ClientLocationModel = require('../../../node_modules/neeedo-api-nodejs-client/models/location'),
    ClientDemandPriceModel = require('../../../node_modules/neeedo-api-nodejs-client/models/demand/price'),
    ClientErrorModel = require('../../../node_modules/neeedo-api-nodejs-client/models/error'),
    ClientDemandListModel = require('../../../node_modules/neeedo-api-nodejs-client/models/demand-list'),
    req = require('../../../node_modules/sails/node_modules/express/lib/request')
    res = require('../../../node_modules/sails/node_modules/express/lib/response')
  ;

var demandListService = new ClientDemandListService();
var clientDemandService = new ClientDemandService();
var clientDemandModel = new ClientDemandModel();

var demandMock = sinon.mock(clientDemandModel);

var givenStubReq = function() {
  return req;
};

var givenSomeDemandParameters = function() {
  var stubbed = {
    param : function(key) {
      switch (key) {
        case 'mustTags' : return 'tag1, tag2';
        case 'shouldTags' : return 'tag3, tag4';
        case 'distance' : return 10;
      }
    }
  };
};

var restoreReq = function() {
   //req.param.restore();
};

var givenDemandMock = function() {
  demandService.newDemand = function() {
    return clientDemandModel;
  };
};

var givenStubbedNewCall = function() {
  demandService.newDemandListService = function() {
    return demandListService;
  };
};

var givenStubbedNewClientDemandServiceCall = function() {
  demandService.newClientDemandService = function() {
    return clientDemandService;
  };
};

var givenAClientDemandListLoadByUserService = function() {
  return sinon.stub(demandListService, "loadByUser");
};

var restoreClientDemandListLoadByUserService = function() {
  demandListService.loadByUser.restore();
};

var givenAClientDemandListLoadMostRecentService = function() {
  return sinon.stub(demandListService, "loadMostRecent");
};

var restoreClientDemandListLoadMostRecentService = function() {
  demandListService.loadMostRecent.restore();
};

var givenAnApiClientService = function() {
  return sinon.stub(sails.services.apiclientservice, "validateAndCreateNewDemandFromRequest");
};

var restoreApiClientService = function() {
  sails.services.apiclientservice.validateAndCreateNewDemandFromRequest.restore();
};

var restoreClientCreateDemandService = function() {
  clientDemandService.createDemand.restore();
};

var givenAUserService = function() {
  return sinon.stub(sails.services.loginservice, 'getCurrentUser', function() { return {};});
};

var restoreUserService = function() {
  sails.services.loginservice.getCurrentUser.restore();
};

var givenAPaginatorServiceMock = function() {
  return sinon.mock(sails.services.paginatorservice);
};

var givenResponsePrototype = function() {
  var DummyResponse = function() {};

  DummyResponse.prototype.status = function(httpCode) {};
  DummyResponse.prototype.json = function(object) {};

  return new DummyResponse();
};

var givenResponseMock = function() {
  return sinon.mock(givenResponsePrototype());
};
//#############################
// TESTS
//#############################

describe('[UNIT TEST] DemandService', function() {

  describe('loadUsersDemands():', function() {
    var stubbedReq, paginatorMock, stubbedDemandListService, stubbedUser;

    before(function(done){
      paginatorMock = givenAPaginatorServiceMock();
      givenStubbedNewCall();

      stubbedDemandListService = givenAClientDemandListLoadByUserService();
      stubbedReq = givenStubReq();
      stubbedUser = givenAUserService();

      done();
    });

    after(function(done){
      restoreClientDemandListLoadByUserService();
      restoreReq();
      restoreUserService();

      done();
    });

    it('should delegate to paginator service', function (done) {
      this.timeout(20000);

      // paginator service should be called
      paginatorMock.expects('getDefaultLimit').once().returns(10);
      paginatorMock.expects('getFirstPageNumber').once().returns(1);
      paginatorMock.expects('calculateOffset').once().calledWith(10, 1);

      // when loadUsersDemandIsCalled
      demandService.loadUsersDemands(stubbedReq, function() {}, function() {});

      paginatorMock.verify();

      done();
    });


    it('should delegate to neeedo-api-nodejs-client', function (done) {
      this.timeout(20000);

      var onSuccessCallback, onErrorCallback = sinon.spy();

      // when loadUsersDemandIsCalled
      demandService.loadUsersDemands(req, onSuccessCallback, onErrorCallback);

      // paginator service should be called
      stubbedDemandListService.called.should.be.True;

      done();
    });
  });

  describe('loadMostRecentDemands():', function() {
    var stubbedReq, paginatorMock, stubbedDemandListService, stubbedUser;

    before(function(done){
      paginatorMock = givenAPaginatorServiceMock();
      givenStubbedNewCall();

      stubbedDemandListService = givenAClientDemandListLoadMostRecentService();
      stubbedReq = givenStubReq();
      stubbedUser = givenAUserService();

      done();
    });

    after(function(done){
      restoreClientDemandListLoadMostRecentService();
      restoreReq();
      restoreUserService();

      done();
    });

    it('should delegate to paginator service', function (done) {
      this.timeout(20000);

      // paginator service should be called
      paginatorMock.expects('getDefaultLimit').once().returns(10);
      paginatorMock.expects('getFirstPageNumber').once().returns(1);
      paginatorMock.expects('calculateOffset').once().calledWith(10, 1);

      // when loadUsersDemandIsCalled
      demandService.loadMostRecentDemands(stubbedReq, function() {}, function() {});

      paginatorMock.verify();

      done();
    });


    it('should delegate to neeedo-api-nodejs-client', function (done) {
      this.timeout(20000);

      var onSuccessCallback, onErrorCallback = sinon.spy();

      // when loadUsersDemandIsCalled
      demandService.loadMostRecentDemands(req, onSuccessCallback, onErrorCallback);

      // paginator service should be called
      stubbedDemandListService.called.should.be.True;

      done();
    });
  });

  describe('createDemand():', function() {
    var stubbedClientService, stubbedReq;

    before(function(done){
      givenStubbedNewClientDemandServiceCall();
      givenDemandMock();

      stubbedClientService = givenAnApiClientService();
      stubbedReq = givenSomeDemandParameters();
      done();
    });

    after(function(done){
      restoreApiClientService();

      done();
    });

    it('should delegate to ApiClientService', function (done) {
      this.timeout(20000);

      var user = {};

      // when loadUsersDemandIsCalled
      var onSuccessCallback, onErrorCallback = sinon.spy();
      demandService.createDemand(stubbedReq, onSuccessCallback, onErrorCallback);

      // demand mock methods should be set
      stubbedClientService.called.should.be.True;

      done();
    });

  });

  /** TODO get working
  describe('sendDemandListJsonResponse():', function() {
    it('should return expected demand list JSON', function (done) {
      this.timeout(20000);

      var demandList = new ClientDemandListModel();

      demandList.addDemand(
        new ClientDemandModel()
          .setId("12345")
          .setMustTags(['IPhone'])
          .setShouldTags(['schwarz'])
          .setLocation(
            new ClientLocationModel()
              .setLatitude(55.5123)
              .setLongitude(40.1234)
          )
          .setPrice(
            new ClientDemandPriceModel()
              .setMin(0)
              .setMax(200)
          )
          .setDistance(100)
      );

      var responseMock = givenResponseMock();

      // response should have been built
      responseMock.expects('status').once().calledWith(200);
      responseMock.expects('json').once().calledWith({
        demandList : demandList
      });

      // when loadUsersDemandIsCalled
      demandService.sendDemandListJsonResponse(responseMock, demandList);

      responseMock.verify();

      done();
    });
  });

  describe('sendErrorJsonResponse():', function() {
    it('should return expected error JSON', function (done) {
      this.timeout(20000);

      var error = new ClientErrorModel();

      error.addErrorMessage('This is a dummy error message.');

      var responseMock = givenResponseMock();

      // response should have been built
      responseMock.expects('status').once().calledWith(400);
      responseMock.expects('json').once().calledWith({
        message : 'This is a dummy error message.'
      });

      // when loadUsersDemandIsCalled
      demandService.sendErrorJsonResponse(responseMock, error);

      responseMock.verify();

      done();
    });
  });*/


});
