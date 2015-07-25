/*
 * dependencies
 */
var MessageService = require('../../../api/services/MessageService'),
  Factory = require('../../library/Factory')
  sinon = require('sinon'),
  should = require('should');

var newClientMessageServiceStub = MessageService.newClientMessageService(),
  newClientConversationListServiceStub = MessageService.newClientConversationListService();

var givenNewClientMessageServiceStub = function () {
  return sinon.stub(MessageService, "newClientMessageService", function () {
    return newClientMessageServiceStub;
  });
};

var restoreNewClientMessageServiceStub = function () {
  MessageService.newClientMessageService.restore();
};

var givenNewClientConversationListServiceStub = function () {
  return sinon.stub(MessageService, "newClientConversationListService", function () {
    return newClientConversationListServiceStub;
  });
};

var restoreNewClientConversationListServiceStub = function () {
  MessageService.newClientConversationListService.restore();
};

var givenClientMessageCreateStub = function () {
  return sinon.stub(newClientMessageServiceStub, "create");
};

var restoreClientMessageCreateStu = function () {
  newClientMessageServiceStub.create.restore();
};

var givenApiClientValidateAndCreateNewMessageFromRequestStub = function () {
  return sinon.stub(sails.services.apiclientservice, "validateAndCreateNewMessageFromRequest", function(req, res) { return {}; });
};

var restoreApiClientValidateAndCreateNewMessageFromRequestStub = function () {
  sails.services.apiclientservice.validateAndCreateNewMessageFromRequest.restore();
};

var givenApiClientNewErrorStub = function () {
  return sinon.stub(sails.services.apiclientservice, "newError", function(logMessage, userMessage) { return {}; });
};

var restoreApiClientNewErrorStub = function () {
  sails.services.apiclientservice.newError.restore();
};

var givenApiClientNewConversationQueryForReadConversationsStub = function () {
  return sinon.stub(sails.services.apiclientservice, "newConversationQueryForReadConversations");
};

var restoreApiClientNewConversationQueryForReadConversationsStub = function () {
  sails.services.apiclientservice.newConversationQueryForReadConversations.restore();
};

var givenApiClientNewConversationQueryForUnreadConversationsStub = function () {
  return sinon.stub(sails.services.apiclientservice, "newConversationQueryForUnreadConversations");
};

var restoreApiClientNewConversationQueryForUnreadConversationsStub = function () {
  sails.services.apiclientservice.newConversationQueryForUnreadConversations.restore();
};

var givenLoadReadConversationsFromSessionStub = function (conversations) {
  return sinon.stub(MessageService, "loadReadConversationsFromSession", function(req) { return conversations; });
};

var restoreLoadReadConversationsFromSessionStub = function () {
  MessageService.loadReadConversationsFromSession.restore();
};

var givenClientConversationLoadBySenderStub = function () {
  return sinon.stub(newClientConversationListServiceStub, "loadBySender");
};

var restoreClientConversationLoadBySenderStub = function () {
  newClientConversationListServiceStub.loadBySender.restore();
};

var givenAGetCurrentUserStub = function (currentUser) {
  return sinon.stub(sails.services.loginservice, "getCurrentUser", function (req) { return currentUser; } );
};

var restoreGetCurrentUserStub = function () {
  sails.services.loginservice.getCurrentUser.restore();
};

var givenAUserIsLoggedInStub = function (isLoggedIn) {
  return sinon.stub(sails.services.loginservice, "userIsLoggedIn", function (req) { return isLoggedIn; } );
};

var restoreUserIsLoggedInStub = function () {
  sails.services.loginservice.userIsLoggedIn.restore();
};

describe('[UNIT TEST] MessageService', function () {
  /* ###########################################
   * #
   * # create
   * #
   * ###########################################
   */
  describe('create on success', function () {
    var createStub;
    before(function (done) {
      givenNewClientMessageServiceStub();
      createStub = givenClientMessageCreateStub();
      givenApiClientValidateAndCreateNewMessageFromRequestStub();

      done();
    });

    after(function (done) {
      restoreNewClientMessageServiceStub();
      restoreClientMessageCreateStu();
      restoreApiClientValidateAndCreateNewMessageFromRequestStub();

      done();
    });

    it("it should delegate to message service", function (done) {
      var req, res = {},
        onSuccessCallback, onErrorCallback = sinon.spy();

      MessageService.create(req, res, onSuccessCallback, onErrorCallback);

      createStub.called.should.be.true;

      done();
    });
  });

  describe('loadUsersOffers on exception', function () {
    var createStub, newErrorStub;
    before(function (done) {
      givenNewClientMessageServiceStub();
      createStub = givenClientMessageCreateStub();
      givenApiClientValidateAndCreateNewMessageFromRequestStub();
      newErrorStub = givenApiClientNewErrorStub();

      done();
    });

    after(function (done) {
      restoreNewClientMessageServiceStub();
      restoreClientMessageCreateStu();
      restoreApiClientValidateAndCreateNewMessageFromRequestStub();
      restoreApiClientNewErrorStub();

      done();
    });

    it("it should create a new error model and call onErrorCallback", function (done) {
      createStub.throws(); // will lead to an exception
      var req, res = {},
        onSuccessCallback, onErrorCallback = sinon.spy();

      MessageService.create(req, res, onSuccessCallback, onErrorCallback);

      newErrorStub.called.should.be.true;
      onErrorCallback.called.should.be.true;

      done();
    });
  });

  /* ###########################################
   * #
   * # loadReadConversations
   * #
   * ###########################################
   */
  describe('loadReadConversations from session on success', function () {
    var createStub;
    before(function (done) {
      givenNewClientConversationListServiceStub();
      givenLoadReadConversationsFromSessionStub({});
      givenAUserIsLoggedInStub(true);
      givenAGetCurrentUserStub({ getId: function() { return 1234; }});

      done();
    });

    after(function (done) {
      restoreNewClientConversationListServiceStub();
      restoreLoadReadConversationsFromSessionStub();
      restoreUserIsLoggedInStub();
      restoreGetCurrentUserStub();

      done();
    });

    it("it should call on successCallback with read conversations from session", function (done) {
      var req = {},
        onSuccessCallback = sinon.spy(),
        onErrorCallback = sinon.spy();

      MessageService.loadReadConversations(req, onSuccessCallback, onErrorCallback);

      onSuccessCallback.called.should.be.true;

      done();
    });
  });

  describe('loadReadConversations via API Client on success', function () {
    var loadBySenderStub;
    before(function (done) {
      givenNewClientConversationListServiceStub();
      givenLoadReadConversationsFromSessionStub(undefined);
      givenApiClientNewConversationQueryForReadConversationsStub();
      loadBySenderStub = givenClientConversationLoadBySenderStub();
      givenAUserIsLoggedInStub(true);
      givenAGetCurrentUserStub({ getId: function() { return 1234; }});

      done();
    });

    after(function (done) {
      restoreNewClientConversationListServiceStub();
      restoreLoadReadConversationsFromSessionStub();
      restoreApiClientNewConversationQueryForReadConversationsStub();
      restoreClientConversationLoadBySenderStub();
      restoreUserIsLoggedInStub();
      restoreGetCurrentUserStub();

      done();
    });

    it("it should delegate to API Client", function (done) {
      var req = {},
        onSuccessCallback = sinon.spy(),
        onErrorCallback = sinon.spy();

      MessageService.loadReadConversations(req, onSuccessCallback, onErrorCallback);

      loadBySenderStub.called.should.be.true;

      done();
    });
  });

  describe('loadReadConversations on error', function () {
    var loadBySenderStub, newErrorStub;
    before(function (done) {
      givenNewClientConversationListServiceStub();
      givenLoadReadConversationsFromSessionStub(undefined);
      givenApiClientNewConversationQueryForReadConversationsStub();
      loadBySenderStub = givenClientConversationLoadBySenderStub();
      newErrorStub = givenApiClientNewErrorStub();
      givenAUserIsLoggedInStub(true);
      givenAGetCurrentUserStub({ getId: function() { return 1234; }});

      done();
    });

    after(function (done) {
      restoreNewClientConversationListServiceStub();
      restoreLoadReadConversationsFromSessionStub();
      restoreApiClientNewConversationQueryForReadConversationsStub();
      restoreClientConversationLoadBySenderStub();
      restoreUserIsLoggedInStub();
      restoreGetCurrentUserStub();
      restoreApiClientNewErrorStub();

      done();
    });

    it("it should create error model and call onErrorCallback", function (done) {
      loadBySenderStub.throws(); // will lead to exception
      var req = {},
        onSuccessCallback = sinon.spy(),
        onErrorCallback = sinon.spy();

      MessageService.loadReadConversations(req, onSuccessCallback, onErrorCallback);

      newErrorStub.called.should.be.true;
      onErrorCallback.called.should.be.true;

      done();
    });
  });

  /* ###########################################
   * #
   * # loadUnReadConversations
   * #
   * ###########################################
   */
  describe('loadUnReadConversations via API Client on success', function () {
    var loadBySenderStub;
    before(function (done) {
      givenNewClientConversationListServiceStub();
      givenApiClientNewConversationQueryForUnreadConversationsStub();
      loadBySenderStub = givenClientConversationLoadBySenderStub();
      givenAGetCurrentUserStub({ getId: function() { return 1234; }});

      done();
    });

    after(function (done) {
      restoreNewClientConversationListServiceStub();
      restoreApiClientNewConversationQueryForUnreadConversationsStub();
      restoreClientConversationLoadBySenderStub();
      restoreGetCurrentUserStub();

      done();
    });

    it("it should delegate to API Client", function (done) {
      var req = {},
        onSuccessCallback = sinon.spy(),
        onErrorCallback = sinon.spy();

      MessageService.loadUnReadConversations(req, onSuccessCallback, onErrorCallback);

      loadBySenderStub.called.should.be.true;

      done();
    });
  });

  describe('loadUnReadConversations via API Client on error', function () {
    var loadBySenderStub, newErrorStub;
    before(function (done) {
      givenNewClientConversationListServiceStub();
      givenApiClientNewConversationQueryForUnreadConversationsStub();
      loadBySenderStub = givenClientConversationLoadBySenderStub();
      givenAGetCurrentUserStub({ getId: function() { return 1234; }});
      newErrorStub = givenApiClientNewErrorStub();

      done();
    });

    after(function (done) {
      restoreNewClientConversationListServiceStub();
      restoreApiClientNewConversationQueryForUnreadConversationsStub();
      restoreClientConversationLoadBySenderStub();
      restoreGetCurrentUserStub();
      restoreApiClientNewErrorStub()

      done();
    });

    it("it should create error model and call onErrorCallback", function (done) {
      loadBySenderStub.throws(); // will lead to exception
      var req = {},
        onSuccessCallback = sinon.spy(),
        onErrorCallback = sinon.spy();

      MessageService.loadUnReadConversations(req, onSuccessCallback, onErrorCallback);

      newErrorStub.called.should.be.true;
      onErrorCallback.called.should.be.true;

      done();
    });
  });
});
