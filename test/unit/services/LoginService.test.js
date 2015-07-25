/*
 * dependencies
 */
var LoginService = require('../../../api/services/LoginService'),
  Factory = require('../../library/Factory')
  sinon = require('sinon'),
  should = require('should');

var newLoginServiceStub = LoginService.newClientLoginService();

var givenANewLoginServiceCall = function () {
  return sinon.stub(LoginService, "newClientLoginService", function () {
    return newLoginServiceStub;
  });
};

var restoreNewLoginServiceCall = function () {
  LoginService.newClientLoginService.restore();
};

var givenLoginServiceLoginUserStub = function () {
  return sinon.stub(newLoginServiceStub, "loginUser");
};

var restoreLoginServiceLoginUserStub = function () {
  newLoginServiceStub.loginUser.restore();
};

var givenApiClientValidateAndCreateNewLoginFromRequestStub = function () {
  return sinon.stub(sails.services.apiclientservice, "validateAndCreateNewLoginFromRequest", function(req, res) { return {}; });
};

var restoreApiClientValidateAndCreateNewLoginFromRequestStub = function () {
  sails.services.apiclientservice.validateAndCreateNewLoginFromRequest.restore();
};

var givenApiClientNewErrorStub = function () {
  return sinon.stub(sails.services.apiclientservice, "newError", function(logMessage, userMessage) { return {}; });
};

var restoreApiClientNewErrorStub = function () {
  sails.services.apiclientservice.newError.restore();
};

var givenAReqStub = function () {
  return {
    session: {
    }
  };
};

var givenAGetCurrentUserStub = function (currentUser) {
  return sinon.stub(LoginService, "getCurrentUser", function (req) { return currentUser; } );
};

var restoreGetCurrentUserStub = function () {
  LoginService.getCurrentUser.restore();
};

var givenAnHasAcessTokenStub = function (user, returnValue) {
  return sinon.stub(user, "hasAccessToken", function () { return returnValue; } );
};

var restoreAnHasAcessTokenStub = function (user) {
  user.hasAccessToken.restore();
};


describe('[UNIT TEST] LoginService', function () {
  /* ###########################################
   * #
   * # loginUser
   * #
   * ###########################################
   */
  describe('loginUser on success', function () {
    var loginUserStub;
    before(function (done) {
      givenANewLoginServiceCall();
      loginUserStub = givenLoginServiceLoginUserStub();
      givenApiClientValidateAndCreateNewLoginFromRequestStub();

      done();
    });

    after(function (done) {
      restoreLoginServiceLoginUserStub();
      restoreNewLoginServiceCall();
      restoreApiClientValidateAndCreateNewLoginFromRequestStub();

      done();
    });

    it("it should delegate to login service", function (done) {
      var req, res = {},
        onSuccessCallback, onErrorCallback = sinon.spy();

      LoginService.loginUser(req, res, onSuccessCallback, onErrorCallback);

      loginUserStub.called.should.be.true;

      done();
    });
  });

  describe('loginUser on exception', function () {
    var loginUserStub, newErrorStub;
    before(function (done) {
      givenANewLoginServiceCall();
      loginUserStub = givenLoginServiceLoginUserStub();
      givenApiClientValidateAndCreateNewLoginFromRequestStub();
      newErrorStub = givenApiClientNewErrorStub();

      done();
    });

    after(function (done) {
      restoreLoginServiceLoginUserStub();
      restoreNewLoginServiceCall();
      restoreApiClientValidateAndCreateNewLoginFromRequestStub();
      restoreApiClientNewErrorStub();

      done();
    });

    it("it should create a new error model and call onErrorCallback", function (done) {
      loginUserStub.throws(); // will lead to an exception
      var req, res = {},
        onSuccessCallback, onErrorCallback = sinon.spy();

      LoginService.loginUser(req, res, onSuccessCallback, onErrorCallback);

      newErrorStub.called.should.be.true;
      onErrorCallback.called.should.be.true;

      done();
    });
  });

  /* ###########################################
   * #
   * # logoutUser
   * #
   * ###########################################
   */
  describe('logoutUser', function () {
    var reqStub;
    before(function (done) {
      reqStub = givenAReqStub();

      done();
    });

    after(function (done) {
      done();
    });

    it("it should destroy the session", function (done) {
      var destroySpy = sinon.spy();
      reqStub.session.destroy = destroySpy;

      LoginService.logoutUser(reqStub);

      destroySpy.called.should.be.true;

      done();
    });
  });

  /* ###########################################
   * #
   * # storeUserInSession
   * #
   * ###########################################
   */
  describe('storeUserInSession', function () {
    var reqStub;
    before(function (done) {
      reqStub = givenAReqStub();

      done();
    });

    after(function (done) {
      done();
    });

    it("it should store the user in session object", function (done) {
      var user = Factory.newUserStub();

      LoginService.storeUserInSession(user, reqStub);

      ("user" in reqStub.session).should.be.true;
      reqStub.session.user.should.be.Object;

      done();
    });

    it("throws exception on illegal argument", function (done) {
      var user = undefined;

      // wrap function to be called because it will be called later within should.throw()
      (function() {
        LoginService.storeUserInSession(user, reqStub);
      }
      ).should.throw();

      done();
    });
  });

  /* ###########################################
   * #
   * # userIsLoggedIn
   * #
   * ###########################################
   */
  describe('userIsLoggedIn if user has access token', function () {
    var currentUserStub, hasAccessTokenStub, reqStub, currentUser;
    before(function (done) {
      reqStub = givenAReqStub();
      currentUser = Factory.newUserStub();
      currentUserStub = givenAGetCurrentUserStub(currentUser);
      hasAccessTokenStub = givenAnHasAcessTokenStub(currentUser, true);

      done();
    });

    after(function (done) {
      restoreGetCurrentUserStub();
      restoreAnHasAcessTokenStub(currentUser);

      done();
    });

    it("it should return true", function (done) {
      LoginService.userIsLoggedIn(reqStub).should.be.true;

      done();
    });
  });

  describe('userIsLoggedIn if user has no access token', function () {
    var currentUserStub, hasAccessTokenStub, reqStub, currentUser;
    before(function (done) {
      reqStub = givenAReqStub();
      currentUser = Factory.newUserStub();
      currentUserStub = givenAGetCurrentUserStub(currentUser);
      hasAccessTokenStub = givenAnHasAcessTokenStub(currentUser, false);

      done();
    });

    after(function (done) {
      restoreGetCurrentUserStub();
      restoreAnHasAcessTokenStub(currentUser);

      done();
    });

    it("it should return false", function (done) {
      LoginService.userIsLoggedIn(reqStub).should.be.false;

      done();
    });
  });

  /* ###########################################
   * #
   * # getCurrentUser
   * #
   * ###########################################
   */
  describe('getCurrentUser', function () {
    var reqStub;
    before(function (done) {
      reqStub = givenAReqStub();

      done();
    });

    after(function (done) {
      done();
    });

    it("returns an appropriate value", function (done) {
      (undefined === LoginService.getCurrentUser(reqStub)).should.be.true;

      done();
    });
  });

  describe('getCurrentUser', function () {
    var reqStub;
    before(function (done) {
      reqStub = givenAReqStub();

      done();
    });

    after(function (done) {
      done();
    });

    it("returns an serialized user object", function (done) {
      reqStub.session.user = {};

      LoginService.getCurrentUser(reqStub).should.be.Object;

      done();
    });
  });
});
