/*
 * dependencies
 */
var ViewService = require('../../../api/services/ViewService'),
  Factory = require('../../library/Factory')
sinon = require('sinon'),
  should = require('should');

describe('[UNIT TEST] ViewService', function () {
  it("calls callback with builded view", function (done) {
    sails.services.viewservice.renderView(
      "403"
      , {}
      , function (html) {
        html.should.be.String;
        // make sure that html element is contained

        html.indexOf("<html>").should.not.be.equal(-1);

        done();
      });
  });
});
