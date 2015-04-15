var request = require('supertest');

describe('CardController', function() {

  describe('#app()', function() {
    it('should print view app.ejs', function (done) {
      this.timeout(20000);
      
      request(sails.hooks.http.app)
        .post('/card/app')
        .send()
        .expect(200);
    });
  });

});
