/*
 * dependencies
 */
var OfferService = require('../../../api/services/OfferService'),
  Factory = require('../../library/Factory')
sinon = require('sinon'),
  should = require('should');

var newOfferListServiceStub = OfferService.newClientOfferListService(),
  newOfferServiceStub = OfferService.newClientOfferService();

var givenANewOfferListStubCall = function () {
  return sinon.stub(OfferService, "newClientOfferListService", function () {
    return newOfferListServiceStub;
  });
};

var restoreNewOfferListStubCall = function () {
  OfferService.newClientOfferListService.restore();
};

var givenANewOfferStubCall = function () {
  return sinon.stub(OfferService, "newClientOfferService", function () {
    return newOfferServiceStub;
  });
};

var restoreNewOfferStubCall = function () {
  OfferService.newClientOfferService.restore();
};

var givenClientOfferListLoadByUserStub = function () {
  return sinon.stub(newOfferListServiceStub, "loadByUser");
};

var restoreClientOfferListLoadByUserStub = function () {
  newOfferListServiceStub.loadByUser.restore();
};

var givenClientOfferListLoadMostRecentStub = function () {
  return sinon.stub(newOfferListServiceStub, "loadMostRecent");
};

var restoreClientOfferListLoadMostRecentStub = function () {
  newOfferListServiceStub.loadMostRecent.restore();
};

var givenApiClientNewOfferQueryFromRequestStub = function () {
  return sinon.stub(sails.services.apiclientservice, "newOfferQueryFromRequest", function(req, res) { return {}; });
};

var restoreApiClientNewOfferQueryFromRequestStub = function () {
  sails.services.apiclientservice.newOfferQueryFromRequest.restore();
};

var givenApiClientNewErrorStub = function () {
  return sinon.stub(sails.services.apiclientservice, "newError", function(logMessage, userMessage) { return {}; });
};

var restoreApiClientNewErrorStub = function () {
  sails.services.apiclientservice.newError.restore();
};

var givenApiClientValidateAndCreateNewOfferFromRequestStub = function () {
  return sinon.stub(sails.services.apiclientservice, "validateAndCreateNewOfferFromRequest",
    function(req, res, onErrorCallback) {
      return { "someobject" : "yes"}; });
};

var restoreApiClientValidateAndCreateNewOfferFromRequestStub = function () {
  sails.services.apiclientservice.validateAndCreateNewOfferFromRequest.restore();
};

var givenApiClientValidateAndSetOfferFromRequestStub = function () {
  return sinon.stub(sails.services.apiclientservice, "validateAndSetOfferFromRequest",
    function(req, res, onErrorCallback) {
      return { "someobject" : "yes"}; });
};

var restoreApiClientValidateAndSetOfferFromRequestStub = function () {
  sails.services.apiclientservice.validateAndSetOfferFromRequest.restore();
};

var givenAUserServiceGetCurrentUser = function() {
  return sinon.stub(sails.services.loginservice, 'getCurrentUser', function() { return {};});
};

var restoreUserServiceGetCurrentUser = function() {
  sails.services.loginservice.getCurrentUser.restore();
};

var givenClientOfferCreateStub = function() {
  return sinon.stub(newOfferServiceStub, 'createOffer');
};

var restoreClientOfferCreateStub = function() {
  newOfferServiceStub.createOffer.restore();
};

var givenAnUpdateOfferStubCall = function() {
  return sinon.stub(newOfferServiceStub, 'updateOffer');
};

var restoreClientOfferUpdateStub = function() {
  newOfferServiceStub.updateOffer.restore();
};

describe('[UNIT TEST] OfferService', function () {
  /* ###########################################
   * #
   * # loadUsersOffers
   * #
   * ###########################################
   */
  describe('loadUsersOffers on success', function () {
    var loadByUserStub;
    before(function (done) {
      givenANewOfferListStubCall();
      loadByUserStub = givenClientOfferListLoadByUserStub();
      givenApiClientNewOfferQueryFromRequestStub();
      givenAUserServiceGetCurrentUser();

      done();
    });

    after(function (done) {
      restoreNewOfferListStubCall();
      restoreClientOfferListLoadByUserStub();
      restoreApiClientNewOfferQueryFromRequestStub();
      restoreUserServiceGetCurrentUser();

      done();
    });

    it("it should delegate to offerlist service", function (done) {
      var req, res = {},
        onSuccessCallback, onErrorCallback = sinon.spy();

      OfferService.loadUsersOffers(req, res, onSuccessCallback, onErrorCallback);

      loadByUserStub.called.should.be.true;

      done();
    });
  });

  describe('loadUsersOffers on exception', function () {
    var loadByUserStub, newErrorStub;
    before(function (done) {
      givenANewOfferListStubCall();
      loadByUserStub = givenClientOfferListLoadByUserStub();
      givenApiClientNewOfferQueryFromRequestStub();
      givenAUserServiceGetCurrentUser();
      newErrorStub = givenApiClientNewErrorStub();

      done();
    });

    after(function (done) {
      restoreNewOfferListStubCall();
      restoreClientOfferListLoadByUserStub();
      restoreApiClientNewOfferQueryFromRequestStub();
      restoreUserServiceGetCurrentUser();
      restoreApiClientNewErrorStub();

      done();
    });

    it("it should create a new error model and call onErrorCallback", function (done) {
      loadByUserStub.throws(); // will lead to an exception
      var req, res = {},
        onSuccessCallback, onErrorCallback = sinon.spy();

      OfferService.loadUsersOffers(req, res, onSuccessCallback, onErrorCallback);

      newErrorStub.called.should.be.true;
      onErrorCallback.called.should.be.true;

      done();
    });
  });

  /* ###########################################
   * #
   * # loadMostRecentOffers
   * #
   * ###########################################
   */
  describe('loadMostRecentOffers on success', function () {
    var loadMostRecentStub;
    before(function (done) {
      givenANewOfferListStubCall();
      loadMostRecentStub = givenClientOfferListLoadMostRecentStub();
      givenApiClientNewOfferQueryFromRequestStub();
      givenAUserServiceGetCurrentUser();

      done();
    });

    after(function (done) {
      restoreNewOfferListStubCall();
      restoreClientOfferListLoadMostRecentStub();
      restoreApiClientNewOfferQueryFromRequestStub();
      restoreUserServiceGetCurrentUser();

      done();
    });

    it("it should delegate to offerlist service", function (done) {
      var req, res = {},
        onSuccessCallback, onErrorCallback = sinon.spy();

      OfferService.loadMostRecentOffers(req, res, onSuccessCallback, onErrorCallback);

      loadMostRecentStub.called.should.be.true;

      done();
    });
  });

  describe('loadMostRecentOffers on exception', function () {
    var loadMostRecentStub, newErrorStub;
    before(function (done) {
      givenANewOfferListStubCall();
      loadMostRecentStub = givenClientOfferListLoadMostRecentStub();
      givenApiClientNewOfferQueryFromRequestStub();
      givenAUserServiceGetCurrentUser();
      newErrorStub = givenApiClientNewErrorStub();

      done();
    });

    after(function (done) {
      restoreNewOfferListStubCall();
      restoreClientOfferListLoadMostRecentStub();
      restoreApiClientNewOfferQueryFromRequestStub();
      restoreUserServiceGetCurrentUser();
      restoreApiClientNewErrorStub();

      done();
    });

    it("it should create a new error model and call onErrorCallback", function (done) {
      loadMostRecentStub.throws(); // will lead to an exception
      var req, res = {},
        onSuccessCallback, onErrorCallback = sinon.spy();

      OfferService.loadMostRecentOffers(req, res, onSuccessCallback, onErrorCallback);

      newErrorStub.called.should.be.true;
      onErrorCallback.called.should.be.true;

      done();
    });
  });

  /* ###########################################
   * #
   * # createOffer
   * #
   * ###########################################
   */
  describe('createOffer on success', function () {
    var createOfferStub;
    before(function (done) {
      givenANewOfferStubCall();
      createOfferStub = givenClientOfferCreateStub();
      givenApiClientValidateAndCreateNewOfferFromRequestStub();

      done();
    });

    after(function (done) {
      restoreNewOfferStubCall();
      restoreClientOfferCreateStub();
      restoreApiClientValidateAndCreateNewOfferFromRequestStub();

      done();
    });

    it("it should delegate to offerlist service", function (done) {
      var req, res = {},
        onSuccessCallback, onErrorCallback = sinon.spy();

      OfferService.createOffer(req, res, onSuccessCallback, onErrorCallback);

      createOfferStub.called.should.be.true;

      done();
    });
  });

  describe('loadUsersOffers on exception', function () {
    var createOfferStub, newErrorStub;
    before(function (done) {
      givenANewOfferStubCall();
      createOfferStub = givenClientOfferCreateStub();
      givenApiClientValidateAndCreateNewOfferFromRequestStub();
      newErrorStub = givenApiClientNewErrorStub();

      done();
    });

    after(function (done) {
      restoreNewOfferStubCall();
      restoreClientOfferCreateStub();
      restoreApiClientValidateAndCreateNewOfferFromRequestStub();
      restoreApiClientNewErrorStub();

      done();
    });

    it("it should create a new error model and call onErrorCallback", function (done) {
      createOfferStub.throws(); // will lead to an exception
      var req, res = {},
        onSuccessCallback, onErrorCallback = sinon.spy();

      OfferService.createOffer(req, res, onSuccessCallback, onErrorCallback);

      newErrorStub.called.should.be.true;
      onErrorCallback.called.should.be.true;

      done();
    });
  });

  /* ###########################################
   * #
   * # updateOffer
   * #
   * ###########################################
   */
  describe('updateOffer on success', function () {
    var updateOfferStub, offerModel;
    before(function (done) {
      givenANewOfferStubCall();
      updateOfferStub = givenAnUpdateOfferStubCall();
      givenApiClientValidateAndSetOfferFromRequestStub();
      offerModel = Factory.newOfferStub();

      done();
    });

    after(function (done) {
      restoreNewOfferStubCall();
      restoreClientOfferUpdateStub();
      restoreApiClientValidateAndSetOfferFromRequestStub();

      done();
    });

    it("it should delegate to offerlist service", function (done) {
      var req, res = {},
        onSuccessCallback, onErrorCallback = sinon.spy();

      OfferService.updateOffer(offerModel, req, res, onSuccessCallback, onErrorCallback);

      updateOfferStub.called.should.be.true;

      done();
    });
  });

  describe('updateOffer on exception', function () {
    var updateOfferStub, newErrorStub;
    before(function (done) {
      givenANewOfferStubCall();
      updateOfferStub = givenAnUpdateOfferStubCall();
      givenApiClientValidateAndSetOfferFromRequestStub();
      offerModel = Factory.newOfferStub();
      newErrorStub = givenApiClientNewErrorStub();

      done();
    });

    after(function (done) {
      restoreNewOfferStubCall();
      restoreClientOfferUpdateStub();
      restoreApiClientValidateAndSetOfferFromRequestStub();

      restoreApiClientNewErrorStub();

      done();
    });

    it("it should create a new error model and call onErrorCallback", function (done) {
      updateOfferStub.throws(); // will lead to an exception
      var req, res = {},
        onSuccessCallback, onErrorCallback = sinon.spy();

      OfferService.updateOffer(offerModel, req, res, onSuccessCallback, onErrorCallback);

      newErrorStub.called.should.be.true;
      onErrorCallback.called.should.be.true;

      done();
    });
  });
});
