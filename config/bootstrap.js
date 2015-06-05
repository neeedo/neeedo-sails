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

var getNeeedoApiUrlFromConfig = function()
{
  if (undefined !== sails.config.neeedo.apiClient.apiUrls.https) {
    return sails.config.neeedo.apiClient.apiUrls.https;
  }

  sails.log.warn('NeeedoApiClient: Falling back to make use of HTTP. This is not recommended!');
  return sails.config.neeedo.apiClient.apiUrls.http;
};

var initializeNeeedoApiNpmClient = function () {
  // initialize by api URL from env config
  apiClient.initClient(
    getNeeedoApiUrlFromConfig(),
    sails.config.neeedo.apiClient.security.https.allow_self_signed_cert,
    sails.log);

};

module.exports.bootstrap = function(cb) {
  initializeNeeedoApiNpmClient();

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
