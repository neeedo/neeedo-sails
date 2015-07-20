/*
 * dependencies
 */
var FavoritesController = require('../../../api/controllers/FavoritesController'),
    Factory = require('../../library/Factory'),
    sinon = require('sinon'),
    should = require('should');

var givenAFavoritesServiceGetFavoriteOffersStub = function(favoriteOffers) {
  return sinon.stub(sails.services.favoritesservice, "getFavoriteOffers", function() {return  favoriteOffers; } );
};

var restoreFavoritesServiceGetFavoriteOffersStub= function() {
  sails.services.favoritesservice.getFavoriteOffers.restore();
};

var getResStub = function(redirectSpy, viewSpy) {
  return {
    redirect: redirectSpy,
    view: viewSpy
  }
};

var givenAFlashMessageServiceSetSuccessStub = function(setSuccessSpy) {
  return sinon.stub(sails.services.flashmessagesservice, "setSuccessMessage", setSuccessSpy );
};

var restoreFlashMessageServiceSetSuccessStub = function() {
  sails.services.flashmessagesservice.setSuccessMessage.restore();
};

describe('[UNIT TEST] FavoritesController', function () {
  describe('favoritesList if length is 0', function() {
    var flashMessageServiceMock, setSucessSpy;
    before(function(done){
      setSucessSpy = sinon.spy();

      givenAFavoritesServiceGetFavoriteOffersStub([]);
      givenAFlashMessageServiceSetSuccessStub(setSucessSpy);

      done();
    });

    after(function(done){
      restoreFavoritesServiceGetFavoriteOffersStub();
      restoreFlashMessageServiceSetSuccessStub();

      done();
    });

    it("should print a flash message and redirect to /", function (done) {
      var redirectSpy = sinon.spy(),
        viewSpy = sinon.spy(),
       res = getResStub(redirectSpy, viewSpy);

      FavoritesController.favoritesList({}, res);

      // locale in request cookie should be returned
      redirectSpy.calledWith('/').should.be.True;
      setSucessSpy
        .calledWith("You didn't add any favorite offer yet. Have a look at the most recent offers below or create a demand.")
        .should.be.True;

      done();
    });
  });

  describe('favoritesList if length is greater than 0', function() {
    var flashMessageServiceMock, setSucessSpy;
    before(function(done){
      setSucessSpy = sinon.spy();

      givenAFavoritesServiceGetFavoriteOffersStub(Factory.newFavoriteListSub());
      givenAFlashMessageServiceSetSuccessStub(setSucessSpy);

      done();
    });

    after(function(done){
      restoreFavoritesServiceGetFavoriteOffersStub();
      restoreFlashMessageServiceSetSuccessStub();

      done();
    });

    it("should view favorite list", function (done) {
      var redirectSpy = sinon.spy(),
        viewSpy = sinon.spy(),
       res = getResStub(redirectSpy, viewSpy);

      FavoritesController.favoritesList({}, res);

      // locale in request cookie should be returned
      viewSpy.calledOnce.should.be.True;

      done();
    });
  });
});
