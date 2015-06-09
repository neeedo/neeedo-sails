var request = require('supertest'),
    should = require('should'),
    sinon = require('sinon'),
    apiClient = require('neeedo-api-nodejs-client')
  ;

var User = apiClient.models.User;

var givenALoggedInUser = function() {
  sinon.stub(sails.services.loginservice, 'userIsLoggedIn', function() {
    return true;
  });

  sinon.stub(sails.services.loginservice, 'getCurrentUser', function() {
    return new User().setUsername('Max');
  });
};

var restoreUserService = function() {
  sails.services.loginservice.userIsLoggedIn.restore();
  sails.services.loginservice.getCurrentUser.restore();
};

//#############################
// TESTS
//#############################

describe('[INTEGRATION TEST] OfferController', function() {

  describe('GET /offers/create when user is logged in', function() {
    before(function(done){
      givenALoggedInUser();

      done();
    });

    after(function(done){
      restoreUserService();

      done();
    });


    it('should contain the offer form', function (done) {
      this.timeout(20000);

    request(sails.hooks.http.app)
        .get('/offers/create')
        .expect('Content-Type', /html/)
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);

          res.text.should.match(/<form/);
          res.text.should.match(/name="tags"/);
          res.text.should.match(/name="price"/);
          res.text.should.match(/name="lat"/);
          res.text.should.match(/name="lng"/);

          done();
        });
    });
  });
});
