var request = require('supertest'),
    should = require('should'),
    sinon = require('sinon');

describe('[ACCEPTANCE TEST] RegistrationController', function() {

  describe('GET /register', function() {
    it('should contain the register form', function (done) {
      this.timeout(20000);

      request(sails.hooks.http.app)
        .get('/register')
        .expect('Content-Type', /html/)
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);

          res.text.should.match(/<form/);
          res.text.should.match(/name="username"/);
          res.text.should.match(/name="email"/);
          res.text.should.match(/name="password"/);

          done();
        });
    });
  });

});
