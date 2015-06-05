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
    useHttps: false,
    maxSizeInBytes: 5000000 , // = 5 MB
    maxCountPerObject: 5, // e.g. max. number of images per offer
    /**
     * Allowed image types:
     *
     * each entry should define a fileType that is checked on upload by the validator class and a description which will be shown to the user
     */
    allowedTypes: [
      {
        fileType: 'image/jpeg',
        description: 'JPEG'
      },

      {
        fileType: 'image/png',
        description: 'PNG'
      },

      {
        fileType: 'image/bmp',
        description: 'BMP'
      },

      {
        fileType: 'image/gif',
        description: 'GIF'
      },
    ]
  }
};
