var should = require('should'),
    sinon = require('sinon'),
    demandService = require('../../../api/services/DemandService'),
    ClientDemandListService = require('../../../node_modules/neeedo-api-nodejs-client/services/demand-list'),
    ClientDemandService = require('../../../node_modules/neeedo-api-nodejs-client/services/demand'),
    ClientDemandModel = require('../../../node_modules/neeedo-api-nodejs-client/models/demand'),
    req = require('../../../node_modules/sails/node_modules/express/lib/request')
  ;

var demandListService = new ClientDemandListService();
var clientDemandService = new ClientDemandService();
var clientDemandModel = new ClientDemandModel();

var demandMock = sinon.mock(clientDemandModel);

var givenStubReq = function() {
  return req;
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

var givenAClientCreateDemandService = function() {
  return sinon.stub(clientDemandService, "createDemand");
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
    var stubbedDemandListService;

    before(function(done){
      givenStubbedNewClientDemandServiceCall();
      givenDemandMock();

      stubbedDemandListService = givenAClientCreateDemandService();
      done();
    });

    after(function(done){
      restoreClientCreateDemandService();

      done();
    });

    it('should set correct fields on demand model', function (done) {
      this.timeout(20000);

      var user = {};

      // demand mock methods should be set
      demandMock.expects('setMustTags').returnsThis().once().calledWith(['tag1', 'tag2']);
      demandMock.expects('setShouldTags').returnsThis().once().calledWith(['tag3', 'tag4']);
      demandMock.expects('setDistance').returnsThis().once().calledWith(10);
      demandMock.expects('setUser').returnsThis().once().calledWith(user);

      // when loadUsersDemandIsCalled
      var onSuccessCallback, onErrorCallback = sinon.spy();
      demandService.createDemand("tag1,tag2", "tag3,tag4", 55.555, 55.555, 10, 0, 20, user, onSuccessCallback, onErrorCallback);

      demandMock.verify();

      done();
    });


    it('should delegate to neeedo-api-nodejs-client', function (done) {
      this.timeout(20000);

      var onSuccessCallback, onErrorCallback = sinon.spy();

      var user = {};
      // when loadUsersDemandIsCalled
      demandService.createDemand("tag1,tag2", "tag3,tag4", 55.555, 55.555, 10, 0, 20, user, onSuccessCallback, onErrorCallback);


      // paginator service should be called
      stubbedDemandListService.called.should.be.True;

      done();
    });
  });
});
