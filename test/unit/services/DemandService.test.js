var should = require('should'),
  sinon = require('sinon'),
  Factory = require('../../library/Factory'),
  DemandService = require('../../../api/services/DemandService'),
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
var clientDemandService = DemandService.newClientDemandService();
var clientDemandModel = new ClientDemandModel();
var clientMatchingService = DemandService.newClientMatchingService();

var demandMock = sinon.mock(clientDemandModel);

var givenStubReq = function () {
  var _req = req
  // stub cookies
  _req.cookies = {};
  return _req;
};

var givenStubRes = function () {
  var _res = res;
  // stub i18n translation function
  _res.i18n = function (string) {
    return string;
  };
  return _res;
};

var givenSomeDemandParameters = function () {
  var stubbed = {
    param: function (key) {
      switch (key) {
        case 'mustTags' :
          return 'tag1, tag2';
        case 'shouldTags' :
          return 'tag3, tag4';
        case 'distance' :
          return 10;
      }
    }
  };
};

var restoreReq = function () {
  //req.param.restore();
};

var givenDemandMock = function () {
  DemandService.newDemand = function () {
    return clientDemandModel;
  };
};

var givenStubbedNewCall = function () {
  DemandService.newDemandListService = function () {
    return demandListService;
  };
};

var givenStubbedNewClientDemandServiceCall = function () {
  sinon.stub(DemandService, "newClientDemandService", function () {
    return clientDemandService;
  });
};

var restoreNewDemandStubCall = function () {
  DemandService.newClientDemandService.restore();
};

var givenNewMatchingServiceStub = function () {
  sinon.stub(DemandService, "newClientMatchingService", function () {
    return clientMatchingService;
  });
};

var restoreNewMatchingServiceStubCall = function () {
  DemandService.newClientMatchingService.restore();
};

var givenAClientDemandListLoadByUserService = function () {
  return sinon.stub(demandListService, "loadByUser");
};

var restoreClientDemandListLoadByUserService = function () {
  demandListService.loadByUser.restore();
};

var givenAClientDemandListLoadMostRecentService = function () {
  return sinon.stub(demandListService, "loadMostRecent");
};

var restoreClientDemandListLoadMostRecentService = function () {
  demandListService.loadMostRecent.restore();
};

var givenAnApiClientService = function () {
  return sinon.stub(sails.services.apiclientservice, "validateAndCreateNewDemandFromRequest");
};

var restoreApiClientService = function () {
  sails.services.apiclientservice.validateAndCreateNewDemandFromRequest.restore();
};

var restoreClientCreateDemandService = function () {
  clientDemandService.createDemand.restore();
};

var givenAUserService = function () {
  return sinon.stub(sails.services.loginservice, 'getCurrentUser', function () {
    return {};
  });
};

var restoreUserService = function () {
  sails.services.loginservice.getCurrentUser.restore();
};

var givenAPaginatorServiceMock = function () {
  return sinon.mock(sails.services.paginatorservice);
};

var givenResponsePrototype = function () {
  var DummyResponse = function () {
  };

  DummyResponse.prototype.status = function (httpCode) {
  };
  DummyResponse.prototype.json = function (object) {
  };

  return new DummyResponse();
};

var givenResponseMock = function () {
  return sinon.mock(givenResponsePrototype());
};

var givenApiClientValidateAndCreateNewDemandFromRequestStub = function () {
  return sinon.stub(sails.services.apiclientservice, "validateAndCreateNewDemandFromRequest",
    function (req, res, onErrorCallback) {
      return {"someobject": "yes"};
    });
};

var restoreApiClientValidateAndCreateNewDemandFromRequestStub = function () {
  sails.services.apiclientservice.validateAndCreateNewDemandFromRequest.restore();
};

var givenApiClientValidateAndSetDemandFromRequestStub = function () {
  return sinon.stub(sails.services.apiclientservice, "validateAndSetDemandFromRequest",
    function (req, res, onErrorCallback) {
      return {"someobject": "yes"};
    });
};

var restoreApiClientValidateAndSetDemandFromRequestStub = function () {
  sails.services.apiclientservice.validateAndSetDemandFromRequest.restore();
};

var givenApiClientNewDemandQueryRequestStub = function () {
  return sinon.stub(sails.services.apiclientservice, "newDemandQueryFromRequest",
    function (req, res, onErrorCallback) {
      return {"someobject": "yes"};
    });
};

var restoreApiClientNewDemandQueryRequestStub = function () {
  sails.services.apiclientservice.newDemandQueryFromRequest.restore();
};

var givenClientDemandCreateStub = function () {
  return sinon.stub(clientDemandService, 'createDemand');
};

var restoreClientDemandCreateStub = function () {
  clientDemandService.createDemand.restore();
};

var givenClientDemandUpdateStub = function () {
  return sinon.stub(clientDemandService, 'updateDemand');
};

var restoreClientDemandUpdateStub = function () {
  clientDemandService.updateDemand.restore();
};

var givenClientDemandDeleteStub = function () {
  return sinon.stub(clientDemandService, 'deleteDemand');
};

var restoreClientDemandDeleteStub = function () {
  clientDemandService.deleteDemand.restore();
};

var givenClientMatchDemandStub = function () {
  return sinon.stub(clientMatchingService, 'matchDemand');
};

var restoreClientMatchDemandStub = function () {
  clientMatchingService.matchDemand.restore();
};

var givenApiClientNewErrorStub = function () {
  return sinon.stub(sails.services.apiclientservice, "newError", function (logMessage, userMessage) {
    return {};
  });
};

var restoreApiClientNewErrorStub = function () {
  sails.services.apiclientservice.newError.restore();
};
//#############################
// TESTS
//#############################

describe('[UNIT TEST] DemandService', function () {

  describe('loadUsersDemands():', function () {
    var stubbedReq, stubbedRes, paginatorMock, stubbedDemandListService, stubbedUser;

    before(function (done) {
      paginatorMock = givenAPaginatorServiceMock();
      givenStubbedNewCall();

      stubbedDemandListService = givenAClientDemandListLoadByUserService();
      stubbedReq = givenStubReq();
      stubbedRes = givenStubRes();
      stubbedUser = givenAUserService();

      done();
    });

    after(function (done) {
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
      DemandService.loadUsersDemands(stubbedReq, stubbedRes, function () {
      }, function () {
      });

      paginatorMock.verify();

      done();
    });


    it('should delegate to neeedo-api-nodejs-client', function (done) {
      this.timeout(20000);

      var onSuccessCallback, onErrorCallback = sinon.spy();

      // when loadUsersDemandIsCalled
      DemandService.loadUsersDemands(req, stubbedRes, onSuccessCallback, onErrorCallback);

      // paginator service should be called
      stubbedDemandListService.called.should.be.True;

      done();
    });
  });

  describe('loadMostRecentDemands():', function () {
    var stubbedReq, stubbedRes, paginatorMock, stubbedDemandListService, stubbedUser;

    before(function (done) {
      paginatorMock = givenAPaginatorServiceMock();
      givenStubbedNewCall();

      stubbedDemandListService = givenAClientDemandListLoadMostRecentService();
      stubbedReq = givenStubReq();
      stubbedRes = givenStubRes();
      stubbedUser = givenAUserService();

      done();
    });

    after(function (done) {
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
      DemandService.loadMostRecentDemands(stubbedReq, stubbedRes, function () {
      }, function () {
      });

      paginatorMock.verify();

      done();
    });


    it('should delegate to neeedo-api-nodejs-client', function (done) {
      this.timeout(20000);

      var onSuccessCallback, onErrorCallback = sinon.spy();

      // when loadUsersDemandIsCalled
      DemandService.loadMostRecentDemands(req, stubbedRes, onSuccessCallback, onErrorCallback);

      // paginator service should be called
      stubbedDemandListService.called.should.be.True;

      done();
    });
  });


  /* ###########################################
   * #
   * # createDemand
   * #
   * ###########################################
   */
  describe('createDemand on success', function () {
    var createDemandStub;
    before(function (done) {
      givenStubbedNewClientDemandServiceCall();
      createDemandStub = givenClientDemandCreateStub();
      givenApiClientValidateAndCreateNewDemandFromRequestStub();

      done();
    });

    after(function (done) {
      restoreNewDemandStubCall();
      restoreClientDemandCreateStub();
      restoreApiClientValidateAndCreateNewDemandFromRequestStub();

      done();
    });

    it("it should delegate to demandlist service", function (done) {
      var req, res = {},
        onSuccessCallback, onErrorCallback = sinon.spy();

      DemandService.createDemand(req, res, onSuccessCallback, onErrorCallback);

      createDemandStub.called.should.be.true;

      done();
    });
  });

  describe('createDemand on exception', function () {
    var createDemandStub, newErrorStub;
    before(function (done) {
      givenStubbedNewClientDemandServiceCall();
      createDemandStub = givenClientDemandCreateStub();
      givenApiClientValidateAndCreateNewDemandFromRequestStub();
      newErrorStub = givenApiClientNewErrorStub();

      done();
    });

    after(function (done) {
      restoreNewDemandStubCall();
      restoreClientDemandCreateStub();
      restoreApiClientValidateAndCreateNewDemandFromRequestStub();
      restoreApiClientNewErrorStub();

      done();
    });

    it("it should create a new error model and call onErrorCallback", function (done) {
      createDemandStub.throws(); // will lead to an exception
      var req, res = {},
        onSuccessCallback, onErrorCallback = sinon.spy();

      DemandService.createDemand(req, res, onSuccessCallback, onErrorCallback);

      newErrorStub.called.should.be.true;
      onErrorCallback.called.should.be.true;

      done();
    });
  });

  /* ###########################################
   * #
   * # updateDemand
   * #
   * ###########################################
   */
  describe('updateDemand on success', function () {
    var updateDemandStub;
    before(function (done) {
      givenStubbedNewClientDemandServiceCall();
      updateDemandStub = givenClientDemandUpdateStub();
      givenApiClientValidateAndSetDemandFromRequestStub();

      done();
    });

    after(function (done) {
      restoreNewDemandStubCall();
      restoreClientDemandUpdateStub();
      restoreApiClientValidateAndSetDemandFromRequestStub();

      done();
    });

    it("it should delegate to demandlist service", function (done) {
      var req, res = {},
        onSuccessCallback, onErrorCallback = sinon.spy();

      DemandService.updateDemand(Factory.newDemandStub(), req, res, onSuccessCallback, onErrorCallback);

      updateDemandStub.called.should.be.true;

      done();
    });
  });

  describe('updateDemand on exception', function () {
    var updateDemandStub, newErrorStub;
    before(function (done) {
      givenStubbedNewClientDemandServiceCall();
      updateDemandStub = givenClientDemandUpdateStub();
      givenApiClientValidateAndSetDemandFromRequestStub();

      newErrorStub = givenApiClientNewErrorStub();

      done();
    });

    after(function (done) {
      restoreNewDemandStubCall();
      restoreClientDemandUpdateStub();
      restoreApiClientValidateAndSetDemandFromRequestStub();
      restoreApiClientNewErrorStub();

      done();
    });

    it("it should create a new error model and call onErrorCallback", function (done) {
      updateDemandStub.throws(); // will lead to an exception
      var req, res = {},
        onSuccessCallback, onErrorCallback = sinon.spy();

      DemandService.updateDemand(Factory.newDemandStub(), req, res, onSuccessCallback, onErrorCallback);

      newErrorStub.called.should.be.true;
      onErrorCallback.called.should.be.true;

      done();
    });

  });

  /* ###########################################
   * #
   * # deleteDemand
   * #
   * ###########################################
   */

  describe('deleteDemand on success', function () {
    var deleteDemandStub;
    before(function (done) {
      givenStubbedNewClientDemandServiceCall();
      deleteDemandStub = givenClientDemandDeleteStub();
      givenApiClientValidateAndSetDemandFromRequestStub();

      done();
    });

    after(function (done) {
      restoreNewDemandStubCall();
      restoreClientDemandDeleteStub();
      restoreApiClientValidateAndSetDemandFromRequestStub();

      done();
    });

    it("it should delegate to demandlist service", function (done) {
      var req, res = {},
        onSuccessCallback, onErrorCallback = sinon.spy();

      DemandService.deleteDemand(Factory.newDemandStub(), onSuccessCallback, onErrorCallback);

      deleteDemandStub.called.should.be.true;

      done();
    });
  });

  describe('deleteDemand on exception', function () {
    var deleteDemandStub, newErrorStub;
    before(function (done) {
      givenStubbedNewClientDemandServiceCall();
      deleteDemandStub = givenClientDemandDeleteStub();
      givenApiClientValidateAndSetDemandFromRequestStub();

      newErrorStub = givenApiClientNewErrorStub();

      done();
    });

    after(function (done) {
      restoreNewDemandStubCall();
      restoreClientDemandDeleteStub();
      restoreApiClientValidateAndSetDemandFromRequestStub();
      restoreApiClientNewErrorStub();

      done();
    });

    it("it should create a new error model and call onErrorCallback", function (done) {
      deleteDemandStub.throws(); // will lead to an exception
      var req, res = {},
        onSuccessCallback, onErrorCallback = sinon.spy();

      DemandService.deleteDemand(Factory.newDemandStub(), onSuccessCallback, onErrorCallback);

      newErrorStub.called.should.be.true;
      onErrorCallback.called.should.be.true;

      done();
    });
  });

  /* ###########################################
   * #
   * # matchOffers
   * #
   * ###########################################
   */

  describe('matchOffers on success', function () {
    var matchDemandStub;
    before(function (done) {
      givenNewMatchingServiceStub();
      matchDemandStub = givenClientMatchDemandStub();
      givenApiClientNewDemandQueryRequestStub();

      done();
    });

    after(function (done) {
      restoreNewMatchingServiceStubCall();
      restoreClientMatchDemandStub();
      restoreApiClientNewDemandQueryRequestStub();

      done();
    });

    it("it should delegate to demandlist service", function (done) {
      var req, res = {},
        onSuccessCallback, onErrorCallback = sinon.spy();

      DemandService.matchOffers(Factory.newDemandStub(), req, res, onSuccessCallback, onErrorCallback);

      matchDemandStub.called.should.be.true;

      done();
    });
  });

  describe('matchOffers on exception', function () {
    var matchDemandStub, newErrorStub;
    before(function (done) {
      givenNewMatchingServiceStub();
      matchDemandStub = givenClientMatchDemandStub();
      givenApiClientNewDemandQueryRequestStub();

      newErrorStub = givenApiClientNewErrorStub();

      done();
    });

    after(function (done) {
      restoreNewMatchingServiceStubCall();
      restoreClientMatchDemandStub();
      restoreApiClientNewDemandQueryRequestStub();
      restoreApiClientNewErrorStub();

      done();
    });

    it("it should create a new error model and call onErrorCallback", function (done) {
      matchDemandStub.throws(); // will lead to an exception
      var req, res = {},
        onSuccessCallback, onErrorCallback = sinon.spy();

      DemandService.matchOffers(Factory.newDemandStub(), req, res, onSuccessCallback, onErrorCallback);

      newErrorStub.called.should.be.true;
      onErrorCallback.called.should.be.true;

      done();
    });
  });
});
