var request = require('supertest'),
    should = require('should'),
    sinon = require('sinon');

describe('[INTEGRATION TEST] LoginController', function() {

  describe('POST /login', function() {
    var spy;

    before(function(done){
      spy = sinon.spy(sails.services.loginservice, 'loginUser');

      done();
    });

    after(function(done){
      sails.services.loginservice.loginUser.restore();

      done();
    });

    it('should delegate to LoginService class', function (done) {
      this.timeout(20000);

      // TODO how to get the following stub working with calling IndexController:onSuccessCallback?
      /*sinon.stub(sails.services.loginservice, 'queryUser', function() {
        return "sth";
      });*/



      request(sails.hooks.http.app)
        .post('/login')
        .expect(302) // 302 Moved temporarily (redirect to /login)
        .end(function(err, res) {
          should.not.exist(err);

          spy.called.should.be.true;

          // expect redirect to /login
          res.text.should.match(/\/register/);

          done();
        });
    });
  });

});
