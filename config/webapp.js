/**
 * Neeedo WebApp Configuration
 * (sails.config.webapp)
 */

module.exports.webapp = {

  /***************************************************************************
  *                                                                          *
  * Pagination                                                                 *
  *                                                                          *
  ***************************************************************************/
  pagination: {
    // default limit if none is given via limit request parameter
    defaultLimit: 10,
    firstPageNumber: 1
  },
  cookie: {
    // cookies maxAge in milliseconds
    maxAge: 31536000000,
    httpOnly: false
  },
  images: {
    // use HTTPS on images GET?
    useHttps: false
  }
};
