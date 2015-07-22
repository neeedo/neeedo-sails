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

var givenApiClientValidateAndCreateNewOfferIdFromRequestStub = function () {
  return sinon.stub(sails.services.apiclientservice, "validateAndCreateNewOfferIdFromRequest",
    function(req, res, onErrorCallback) {
      return "offer1"; });
};

var restoreApiClientValidateAndCreateNewOfferIdFromRequestStub = function () {
  sails.services.apiclientservice.validateAndCreateNewOfferIdFromRequest.restore();
};

var givenAUserServiceGetCurrentUser = function() {
  return sinon.stub(sails.services.loginservice, 'getCurrentUser', function() { return {};});
};

var restoreUserServiceGetCurrentUser = function() {
  sails.services.loginservice.getCurrentUser.restore();
};

var givenClientOfferLoadStub = function() {
  return sinon.stub(newOfferServiceStub, 'load');
};

var restoreClientOfferLoadStub = function() {
  newOfferServiceStub.load.restore();
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

var givenADeleteOfferStubCall = function() {
  return sinon.stub(newOfferServiceStub, 'deleteOffer');
};

var restoreClientOfferDeleteStub = function() {
  newOfferServiceStub.deleteOffer.restore();
};

var givenAnIsInSessionStub = function(isInSession) {
  return sinon.stub(OfferService, 'isInSession', function(req, offerId) { return isInSession});
};

var restoreIsInSessionStub = function() {
  OfferService.isInSession.restore();
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

  /* ###########################################
   * #
   * # deleteOffer
   * #
   * ###########################################
   */
  describe('deleteOffer on success', function () {
    var deleteOfferStub, offerModel;
    before(function (done) {
      givenANewOfferStubCall();
      deleteOfferStub = givenADeleteOfferStubCall();
      offerModel = Factory.newOfferStub();

      done();
    });

    after(function (done) {
      restoreNewOfferStubCall();
      restoreClientOfferDeleteStub();

      done();
    });

    it("it should delegate to offerlist service", function (done) {
      var req, res = {},
        onSuccessCallback, onErrorCallback = sinon.spy();

      OfferService.deleteOffer(offerModel, onSuccessCallback, onErrorCallback);

      deleteOfferStub.called.should.be.true;

      done();
    });
  });

  describe('deleteOffer on exception', function () {
    var deleteOfferStub, newErrorStub, offerModel;
    before(function (done) {
      givenANewOfferStubCall();
      deleteOfferStub = givenADeleteOfferStubCall();
      offerModel = Factory.newOfferStub();
      newErrorStub = givenApiClientNewErrorStub();

      done();
    });

    after(function (done) {
      restoreNewOfferStubCall();
      restoreClientOfferDeleteStub();

      restoreApiClientNewErrorStub();

      done();
    });

    it("it should create a new error model and call onErrorCallback", function (done) {
      deleteOfferStub.throws(); // will lead to an exception
      var req, res = {},
        onSuccessCallback, onErrorCallback = sinon.spy();

      OfferService.deleteOffer(offerModel, onSuccessCallback, onErrorCallback);

      newErrorStub.called.should.be.true;
      onErrorCallback.called.should.be.true;

      done();
    });
  });

  describe('storeInSession', function () {
    it("it should store the offer as expected in session object", function (done) {
      var req = { session: {}},
        offer = Factory.newOfferStub();

      OfferService.storeInSession(req, offer);

      ("offers" in req.session).should.be.true;
      ("offer1" in req.session.offers).should.be.true;
      req.session.offers["offer1"].should.be.Object;

      done();
    });
  });

  describe('storeListInSession', function () {
    it("it should store the offer as expected in session object", function (done) {
      var req = { session: {}},
        offerList = Factory.newOfferListStub(true);

      OfferService.storeListInSession(req, offerList);

      ("offers" in req.session).should.be.true;
      ("offer1" in req.session.offers).should.be.true;
      req.session.offers["offer1"].should.be.Object;

      done();
    });
  });

  describe('removeFromSession', function () {
    it("it should have been set to undefined", function (done) {
      var
        offer = Factory.newOfferStub(),
        req = {
          session: {
          offers: {
            "offer1": offer
          }
        }};

      OfferService.removeFromSession(req, offer);

      (undefined === req.session.offers.offer1).should.be.true;

      done();
    });
  });

  /* ###########################################
   * #
   * # loadOffer
   * #
   * ###########################################
   */
  describe('loadOffer if offer is in session', function () {
    var loadMostRecentStub;
    before(function (done) {
      givenAnIsInSessionStub(true);
      givenApiClientValidateAndCreateNewOfferIdFromRequestStub();

      done();
    });

    after(function (done) {
      restoreIsInSessionStub();
      restoreApiClientValidateAndCreateNewOfferIdFromRequestStub();

      done();
    });

    it("it should call onSuccessCallback with serialized offerMOdel", function (done) {
      var offerStub = Factory.newOfferStub(),
        req = {
          session: {
            offers: {
              "offer1" : offerStub
            }
          }
        }, res = {},
        onSuccessCallback = sinon.spy(),
        onErrorCallback = sinon.spy();

      OfferService.loadOffer(req, res, onSuccessCallback, onErrorCallback);

      onSuccessCallback.called.should.be.true;

      done();
    });
  });

  describe('loadOffer if offer is not in session', function () {
    var loadOfferStub;
    before(function (done) {
      givenANewOfferStubCall();
      givenAnIsInSessionStub(false);
      givenApiClientValidateAndCreateNewOfferIdFromRequestStub();
      loadOfferStub = givenClientOfferLoadStub();

      done();
    });

    after(function (done) {
      restoreIsInSessionStub();
      restoreApiClientValidateAndCreateNewOfferIdFromRequestStub();
      restoreNewOfferStubCall();
      restoreClientOfferLoadStub();

      done();
    });

    it("it should call onSuccessCallback with serialized offerMOdel", function (done) {
      var offerStub = Factory.newOfferStub(),
        req = {
          session: {
            offers: {
              "offer1" : offerStub
            }
          }
        }, res = {},
        onSuccessCallback = sinon.spy(),
        onErrorCallback = sinon.spy();

      OfferService.loadOffer(req, res, onSuccessCallback, onErrorCallback);

      loadOfferStub.called.should.be.true;

      done();
    });
  });

});
