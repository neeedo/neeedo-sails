/*
 * dependencies
 */
var FavoritesService = require('../../../api/services/FavoritesService'),
    Factory = require('../../library/Factory'),
    sinon = require('sinon'),
    should = require('should');

var givenALoginServiceGetCurrentUserStub = function(currentUser) {
  return sinon.stub(sails.services.loginservice, "getCurrentUser", function() {return  currentUser; } );
};

var restoreLoginServiceGetCurrentUserStub = function() {
  sails.services.loginservice.getCurrentUser.restore();
};

var givenALoginServiceStoreUserInSessionStub = function(storeUserStub) {
  return sinon.stub(sails.services.loginservice, "storeUserInSession", storeUserStub);
};

var restoreLoginServiceStoreUserInSessionStub = function() {
  sails.services.loginservice.storeUserInSession.restore();
};

var givenAFavoriteServiceWereAlreadyLoadedInSessionStub = function(wereLoaded) {
  return sinon.stub(sails.services.favoritesservice, "favoritesWereAlreadyLoadedInSession", function() { return wereLoaded; });
};

var restoreFavoriteServiceWereAlreadyLoadedInSessionStub = function() {
  sails.services.favoritesservice.favoritesWereAlreadyLoadedInSession.restore();
};

var givenAFavoriteServiceStoreFavoriteInSessionStub = function(storeFavoriteStub) {
  return sinon.stub(sails.services.favoritesservice, "storeFavoriteOffersInSession", storeFavoriteStub);
};

var restoreFavoriteServiceStoreFavoriteInSessionStub = function() {
  sails.services.favoritesservice.storeFavoriteOffersInSession.restore();
};

var givenAnApiClientServiceNewOfferList = function(offerList) {
  return sinon.stub(sails.services.apiclientservice, "newOfferList", function() { return offerList; });
};

var restoreApiClientServiceNewOfferList = function() {
  sails.services.apiclientservice.newOfferList.restore();
};

var givenAnUserGetFavoriteOfferList = function(user) {
  return sinon.stub(user, "getFavoriteOfferList", function() { return Factory.newOfferListStub(true) });
};

var restoreUserGetFavoriteOfferList = function(user) {
  user.getFavoriteOfferList.restore();
};

describe('[UNIT TEST] FavoritesService', function () {
  describe('favoritesWereAlreadyLoadedInSession', function() {
    var flashMessageServiceMock, setSucessSpy;
    before(function(done){
      setSucessSpy = sinon.spy();

      givenALoginServiceGetCurrentUserStub(Factory.newUserStub());

      done();
    });

    after(function(done){
      restoreLoginServiceGetCurrentUserStub();

      done();
    });

    it("behaves as expected", function (done) {
      var req = {};

      FavoritesService.favoritesWereAlreadyLoadedInSession(req).should.be.False;

      done();
    });
  });

  describe('removeFavoriteOfferFromSession', function() {
    before(function(done){
      givenAFavoriteServiceWereAlreadyLoadedInSessionStub(false);
      givenALoginServiceGetCurrentUserStub(Factory.newUserStub());


      done();
    });

    after(function(done){
      restoreFavoriteServiceWereAlreadyLoadedInSessionStub();
      restoreLoginServiceGetCurrentUserStub();

      done();
    });

    it("calls onSuccessCallback immediatly if no favorites in session", function (done) {
      var req = {},
        res = {},
        favoritesModel = {},
        onSuccessCallbackSpy = sinon.spy(),
        onErrorCallbackSpy = sinon.spy(),
        givenFavoritesList = [];

      FavoritesService.removeFavoriteOfferFromSession(req, res, favoritesModel, onSuccessCallbackSpy, onErrorCallbackSpy);

      onSuccessCallbackSpy.calledOnce.should.be.True;

      done();
    });
  });

  describe('removeFavoriteOfferFromSession', function() {
    var storeSpy, newOfferList, user;

    before(function(done){
      user = Factory.newUserStub();
      storeSpy = sinon.spy();
      givenAFavoriteServiceWereAlreadyLoadedInSessionStub(false);
      givenALoginServiceGetCurrentUserStub(user);
      givenALoginServiceStoreUserInSessionStub(storeSpy);
      givenAFavoriteServiceStoreFavoriteInSessionStub(storeSpy);
      givenAnUserGetFavoriteOfferList(user);

      newOfferList = Factory.newOfferListStub(false);
      givenAnApiClientServiceNewOfferList(newOfferList);


      done();
    });

    after(function(done){
      restoreFavoriteServiceWereAlreadyLoadedInSessionStub(true);
      restoreLoginServiceGetCurrentUserStub();
      restoreLoginServiceStoreUserInSessionStub();
      restoreFavoriteServiceStoreFavoriteInSessionStub();
      restoreApiClientServiceNewOfferList();
      restoreUserGetFavoriteOfferList(user);

      done();
    });

    it("removes favorite offer from list", function (done) {
      var req = {},
        res = {},
        favoritesModel = Factory.newFavoriteStub(),
        onSuccessCallbackSpy = sinon.spy(),
        onErrorCallbackSpy = sinon.spy(),
        givenFavoritesList = [];

      FavoritesService.removeFavoriteOfferFromSession(req, res, favoritesModel, onSuccessCallbackSpy, onErrorCallbackSpy);

      // make sure that offer from library is not contained in new offer list

      onSuccessCallbackSpy.calledOnce.should.be.True;
      storeSpy.calledOnce.should.be.True;

      done();
    });
  });

  describe('favoritesWereAlreadyLoadedInSession', function() {
    var user, setSucessSpy, setFavoriteOfferListSpy, storeUserInSessionSpy;
    before(function(done){
      setSucessSpy = sinon.spy();
      setFavoriteOfferListSpy = sinon.spy();
      storeUserInSessionSpy = sinon.spy();

      user = Factory.newUserStub();
      user.setFavoriteOfferList = setFavoriteOfferListSpy;

      givenALoginServiceGetCurrentUserStub(user);
      givenALoginServiceStoreUserInSessionStub(storeUserInSessionSpy);

      done();
    });

    after(function(done){
      restoreLoginServiceGetCurrentUserStub();
      restoreLoginServiceStoreUserInSessionStub();

      done();
    });

    it("delegates to user object where favorite list is stored", function (done) {
      var req = {},
        givenFavoritesList = [];

      FavoritesService.storeFavoriteOffersInSession(req, givenFavoritesList);

      setFavoriteOfferListSpy.calledWith(givenFavoritesList).should.be.True;
      storeUserInSessionSpy.calledWith(user).should.be.True;

      done();
    });
  });
});
