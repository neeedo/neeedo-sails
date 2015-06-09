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
    resolution: { // max resolution in pixel - uploaded images will be resized to fit the max resolution before pushing to API
      maxHeight : 500,
      maxWidth : 500
    },
    /**
     * The processes should only be disabled for testing purpose or on critical errors - this is not recommended on LIVE!
     */
    processing: {
      validators : true, // activate image validation?
      filters : true // activate image processing / filter, like rescaling?
    },
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
  },
  geolocation: {
    /*
     * fallback values if the browser didn't sent correct geolocation values
     *
     * The default lat lng values are mapped to the current user's configured locale (see LocaleService).
     */
    defaults: {
      de: {
        // Berlin, Germany
        latitude: 52.518611111111,
        longitude: 13.40833333333334
      },
      en: {
        // London, Germany
        latitude: 51.50939,
        longitude: -0.11832
      }
    }
  }
};
