/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */
var apiClient = require('neeedo-api-nodejs-client');

var initializeNeeedoApiNpmClient = function () {
  console.log("initializing neeedo api client... " + sails.config.neeedo.apiUrl);
  // initialize by api URL from env config
  apiClient.initClient(sails.config.neeedo.apiUrl);

}

module.exports.bootstrap = function(cb) {
  initializeNeeedoApiNpmClient();

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
