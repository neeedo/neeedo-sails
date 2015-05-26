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
  }
};
