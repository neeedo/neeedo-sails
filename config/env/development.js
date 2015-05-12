/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  // models: {
  //   connection: 'someMongodbServer'
  // }
  /***************************************************************************
   *                                                                         *
   * NEEEDO Services                                                         *
   *                                                                         *
   ***************************************************************************/
  neeedo: {
    // URL to development neeedo-api
    apiClient : {
      apiUrl: 'https://localhost:9443',
      debugMode: true,
      security: {
        https : {
          // whether to allow self-signed TLS certificates
          allow_self_signed_cert : true
        }
      }
    }
  },
  session: {
    cookie: {
      maxAge: 24 * 60 * 60 * 1000
      }
  }
  };
