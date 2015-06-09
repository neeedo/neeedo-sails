var request = require('supertest');

describe('[INTEGRATION TEST] CardController', function() {

  describe('POST /card/app', function() {
    it('should print view app.ejs', function (done) {
      this.timeout(20000);

      request(sails.hooks.http.app)
        .post('/card/app')
        .send()
        .expect(200);

      done();
    });
  });

});
