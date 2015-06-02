var request = require('supertest'),
    should = require('should'),
    sinon = require('sinon');

describe('[ACCEPTANCE TEST] LoginController', function() {

  describe('GET /login', function() {
    it('should contain the login form', function (done) {
      this.timeout(20000);

      request(sails.hooks.http.app)
        .get('/login')
        .expect('Content-Type', /html/)
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);

          res.text.should.match(/<form/);
          res.text.should.match(/type="email"/);
          res.text.should.match(/type="password"/);

          done();
        });
    });
  });

  describe('POST /login', function() {
    var spy;

    before(function(done){
      spy = sinon.spy(sails.services.loginservice, 'queryUser');

      done();
    });

    after(function(done){
      sails.services.loginservice.queryUser.restore();

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
          res.text.should.match(/\/login/);

          done();
        });
    });
  });

});
